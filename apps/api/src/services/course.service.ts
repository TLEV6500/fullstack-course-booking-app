import mongoose, { type HydratedDocument } from "mongoose";
import { UserNotFoundError } from "../errors/user.error.ts";
import { zCourse, Course } from "../models/courses/index.ts";
import { User } from "../models/users/index.ts";
import { CourseCreationError, CourseNotFoundError } from "../errors/course.error.ts";
import { DomainError, handleFailure, UnauthorizedAccessError } from "../errors/common.error.ts";
import { safeRegexEscape } from "../utils/sanitation.ts";

export async function createCourses(id: string, courses: zCourse.CreateCoursesInput) {
    const user = await User.findById(id)
    if (!user || !user.id || !user.isAdmin) return new UserNotFoundError({ message: "Unauthorized" })
    let failedCourseCreations = 0;
    const session = await mongoose.startSession()
    try {
        return await session.withTransaction(async () => {
            let newCourses = (await Course.create(courses, { session }))
            failedCourseCreations = courses.length - newCourses.length
            return newCourses as zCourse.CreateCoursesOutput;
        })
    } catch (e) {
        return new CourseCreationError({ message: `Failed to create ${failedCourseCreations} courses`, cause: e })
    }
}


export async function getCourses(userId: string, params: zCourse.GetCoursesInput) {
    const user = userId ? await User.findById(userId) : null
    const isAdmin = !!user?.isAdmin
    let courses: zCourse.GetCoursesOutput
    if (params.id) {
        const course = await Course.findById(params.id)
        if (!course) return new CourseNotFoundError({ message: "Course not found" })
        if (!isAdmin && !course.isActive) return new UnauthorizedAccessError({ message: "You are not authorized to access this resource" })
        courses = [course]
    } else {
        const escapedQuery = handleFailure(safeRegexEscape(params.q), 400)
        courses = await Course.find({
            name: { $regex: escapedQuery },
            isActive: isAdmin ? undefined : true
        }, null, {
            limit: params.limit ?? 10,
            skip: params.offset ?? 0
        })
    }
    return courses as zCourse.GetCoursesOutput
}

export async function updateCourse(courseId: string, course: zCourse.UpdateCourseInput, userId: string) {
    const user = await User.findById(userId)
    if (!user) return new UserNotFoundError({ message: "User not found" })
    if (!user.isAdmin) return new UnauthorizedAccessError({ message: "You are not authorized to access this resource" })

    const updatedCourse = await Course.findByIdAndUpdate(courseId, course, { new: true })

    if (!updatedCourse) {
        return new CourseNotFoundError({ message: `Course ${courseId} not found` })
    }
    return updatedCourse as zCourse.UpdateCourseOutput
}


export async function deleteCourse(courseId: string, userId: string) {
    const user = await User.findById(userId)
    if (!user) return new UserNotFoundError({ message: "User not found" })
    if (!user.isAdmin) return new UnauthorizedAccessError({ message: "You are not authorized to access this resource" })

    const deletedCourse = await Course.findByIdAndDelete(courseId)

    if (!deletedCourse) return new CourseNotFoundError({ message: `Course ${courseId} not found` })
    return deletedCourse as zCourse.DeleteCourseOutput
}
