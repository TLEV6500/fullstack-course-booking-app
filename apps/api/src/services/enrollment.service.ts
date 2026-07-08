import mongoose from "mongoose";
import { CourseNotFoundError } from "../errors/course.error.ts";
import { EnrollmentNotFoundError } from "../errors/enrollment.error.ts";
import { AuthenticationFailedError, UserNotFoundError } from "../errors/user.error.ts";
import { Course } from "../models/courses/index.ts";
import { Enrollment, zEnrollment } from "../models/enrollments/index.ts";
import { User } from "../models/users/index.ts";
import { DuplicateResourceError } from "../errors/db.error.ts";
import type { UserDocument } from "../models/users/User.model.ts";

// function enrollmentToObject<EnrollmentDocument extends zEnrollment.Enrollment & {userId: mongoose.Types.ObjectId}>(enrollment: EnrollmentDocument) {
//     return {
//         ...enrollment,
//         enrolledCourses: enrollment.enrolledCourses.map((courseId) => courseId.toString()),
//         userId: enrollment.userId.toString(),
//     }
// }

export async function enrollCourse(userId: string, courseId: string) {
    const user = await User.findById(userId);
    if (!user) {
        return new AuthenticationFailedError({message:"Unauthorized: User record no longer exists."});
    }

    const course = await Course.findById(courseId);
    if (!course) {
        return new CourseNotFoundError({message: "Course not found."});
    }

    let enrollment = await Enrollment.findOne({ userId });
    if (!enrollment) {
        enrollment = new Enrollment({ userId, enrolledCourses: [] });
    }

    const isAlreadyEnrolled = enrollment.enrolledCourses.some(
        (id) => id.toString() === courseId
    );
    if (isAlreadyEnrolled) {
        return new DuplicateResourceError({message: "User is already enrolled."});
    }

    enrollment.enrolledCourses.push(new mongoose.Types.ObjectId(courseId));

    const result = (await enrollment.save()).toObject({ virtuals: true })

    const final:zEnrollment.EnrollmentOutput = {
        ...result,
        enrolledCourses: result.enrolledCourses.map((courseId) => courseId.toString()),
        userId: result.userId.toString(),
    }

    return final;
}


export async function getEnrollments(currentUserId: string, targetUserId: string, query: zEnrollment.GetEnrollmentInput) {
    const targetUser = await User.findById(targetUserId).lean();
    if (!targetUser) return new UserNotFoundError({ message: "Unauthorized" });
    if (targetUser._id.toString() !== currentUserId) {
        const admin = await User.findById(currentUserId).lean();
        if (!admin || !admin.isAdmin) return new AuthenticationFailedError({ message: "Forbidden" });
    }

    const { limit = 10, offset = 0, expand } = query;

    const mongooseQuery = Enrollment.find()
        .skip(offset)
        .limit(limit)
        .lean();

    if (expand === "user") {
        mongooseQuery.populate({
            path: "userId",
            select: "_id firstName lastName"
        });
    } else if (expand === "courses") {
        mongooseQuery.populate({
            path: "enrolledCourses",
            select: "-createdOn -lastUpdatedOn -isActive"
        });
    }

    let [enrollment] = await mongooseQuery.exec();

    if (!enrollment) {
        enrollment = await new Enrollment({ targetUserId, enrolledCourses: [] }).save();
    }

    let output: zEnrollment.GetEnrollmentsOutput

    const baseData = {
        enrollmentId: enrollment._id.toString(),
    };

    if (expand === "user") {
        const populatedUser = enrollment.userId as Exclude<typeof enrollment.userId, mongoose.Types.ObjectId>;
        output = {
            ...baseData,
            expanded: "user",
            user: populatedUser ? {
                id: populatedUser._id.toString(),
                firstName: populatedUser.firstName,
                lastName: populatedUser.lastName,
            } : undefined,
        };
    } else if (expand === "courses") {
        const populatedCourses = enrollment.enrolledCourses;
        output = {
            ...baseData,
            expanded: "courses",
            courses: populatedCourses.map((course: Exclude<typeof enrollment.enrolledCourses[0], mongoose.Types.ObjectId>) => ({
                id: course._id.toString(),
                name: course.name,
                description: course.description,
                price: course.price,
            })),
        };
    } else {
        output = {
            ...baseData,
            expanded: false,
            userId: enrollment.userId.toString(),
            enrolledCourses: enrollment.enrolledCourses.map((id) => id.toString()),
        };
    }

    return output as zEnrollment.GetEnrollmentsOutput
}
