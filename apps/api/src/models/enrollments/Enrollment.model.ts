import mongoose from "mongoose";
import type { Enrollment } from "./Enrollment.zod.ts";
import { SCHEMA_OPTS } from "../mongoose.ts";

type EnrollmentDocument = Omit<Enrollment, "id" | "userId" | "enrolledCourses"> & {
    userId: mongoose.Schema.Types.ObjectId;
    enrolledCourses: {
        courseId: mongoose.Schema.Types.ObjectId;
    }[];
}
type EnrollmentVirtuals = {
    id: string;
}
type EnrollmentModel = mongoose.Model<EnrollmentDocument, {}, {}, EnrollmentVirtuals>;

const enrollmentSchema = new mongoose.Schema<EnrollmentDocument, EnrollmentModel, {}, {}, EnrollmentVirtuals>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is Required"],
    },
    enrolledCourses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: [true, "Course ID is Required"],
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: [true, "totalPrice is Required"],
    },
    enrolledOn: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Enrolled",
    },
}, SCHEMA_OPTS);

export default mongoose.model<EnrollmentDocument, EnrollmentModel>("Enrollment", enrollmentSchema);
