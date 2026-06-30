import mongoose from "mongoose"
import * as z from "zod"

export const ObjectId = z.string().refine(val => mongoose.isValidObjectId(val), {
    error: "Invalid MongoDB ObjectId"
}).transform(val => new mongoose.Types.ObjectId(val))
