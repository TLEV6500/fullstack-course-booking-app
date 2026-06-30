import mongoose from "mongoose";
import { SCHEMA_OPTS } from "../mongoose.ts";
import type { Course } from "./Course.zod.ts";

type CourseDocument = Omit<Course, "id">
type CourseVirtuals = {
    id: string;
}
type CourseModel = mongoose.Model<CourseDocument, {}, {}, CourseVirtuals>;

const courseSchema = new mongoose.Schema<CourseDocument, CourseModel, {}, {}, CourseVirtuals>({
    name: {
        type: String,
        required: [true, "Course Name is Required"],
    },
    description: {
        type: String,
        required: [true, "Course Description is Required"],
    },
    price: {
        type: Number,
        required: [true, "Course Price is Required"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    lastUpdatedOn: {
        type: Date,
        default: Date.now,
    },
}, SCHEMA_OPTS);

export default mongoose.model<CourseDocument, CourseModel>("Course", courseSchema);
