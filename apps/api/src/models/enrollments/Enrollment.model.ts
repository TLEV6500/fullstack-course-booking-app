import mongoose from "mongoose";
import type { Enrollment } from "./Enrollment.zod.ts";
import { SCHEMA_OPTS } from "../mongoose.ts";
import type { CourseDocument } from "../courses/Course.model.ts";
import type { UserDocument } from "../users/User.model.ts";

type EnrollmentDocument = Omit<Enrollment, "id" | "userId" | "enrolledCourses"> & {
    userId: mongoose.PopulatedDoc<UserDocument & mongoose.Document, mongoose.Types.ObjectId>;
    enrolledCourses: mongoose.PopulatedDoc<CourseDocument & mongoose.Document, mongoose.Types.ObjectId>[];
}
type EnrollmentVirtuals = {
    id: string;
}
type EnrollmentModel = mongoose.Model<EnrollmentDocument, {}, {}, EnrollmentVirtuals>;

const enrollmentSchema = new mongoose.Schema < EnrollmentDocument, EnrollmentModel, { }, { }, EnrollmentVirtuals>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is Required"],
    },
    enrolledCourses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Course",
        required: [true, "Course ID is Required"],
        default: [],
    },
    totalPrice: {
        type: Number,
        required: [true, "totalPrice is Required"],
    },
    status: {
        type: String,
        default: "Enrolled",
    },
}, SCHEMA_OPTS);

export default mongoose.model<EnrollmentDocument, EnrollmentModel>("Enrollment", enrollmentSchema);
