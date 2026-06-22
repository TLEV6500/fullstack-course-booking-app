import * as z from "zod"

export const ObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId")
