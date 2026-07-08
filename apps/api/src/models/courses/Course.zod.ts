import * as z from "zod";

export const Course = z.object({
    name: z.string().min(4),
    description: z.string(),
    price: z.number().nonnegative(),
    isActive: z.boolean().default(true),
    createdOn: z.date(),
    lastUpdatedOn: z.date(),
    id: z.string().min(1),
})
export type Course = z.infer<typeof Course>

export const GetCoursesQueryParams = z.object({
    q: z.string().optional(),
    limit: z.coerce.number().nonnegative().default(10).optional(),
    offset: z.coerce.number().nonnegative().default(0).optional(),
})
export const GetCoursesPathParams = z.object({
    id: z.string().min(1).optional(),
})
export type GetCoursesInput = z.infer<typeof GetCoursesQueryParams & typeof GetCoursesPathParams>

export const GetCoursesResponse = z.object({
    courses: z.array(Course.omit({
        isActive: true,
    })),
})
export type GetCoursesOutput = z.infer<typeof GetCoursesResponse.shape.courses>

export const CreateCoursesRequest = z.object({
    courses: z.array(Course.omit({
        isActive: true,
        createdOn: true,
        lastUpdatedOn: true,
    }))
})
export type CreateCoursesInput = z.infer<typeof CreateCoursesRequest.shape.courses>

export const CreateCoursesResponse = z.object({
    courses: z.array(Course.omit({
        isActive: true,
        createdOn: true,
        lastUpdatedOn: true,
    })),
})
export type CreateCoursesOutput = z.infer<typeof CreateCoursesResponse.shape.courses>

export const UpdateCourseRequest = z.object({
    courseChanges: Course.omit({
        createdOn: true,
        lastUpdatedOn: true,
        id: true,
    }).partial()
})
export const UpdateCoursePathParams = z.object({
    id: z.string().min(1),
})
export type UpdateCourseInput = z.infer<typeof UpdateCourseRequest> & z.infer<typeof UpdateCoursePathParams>

export const UpdateCourseResponse = z.object({
    updatedCourse: Course
})
export type UpdateCourseOutput = z.infer<typeof UpdateCourseResponse.shape.updatedCourse>

export const DeleteCoursePathParams = z.object({
    id: z.string().min(1),
})
export type DeleteCourseInput = z.infer<typeof DeleteCoursePathParams>

export const DeleteCourseResponse = Course.omit({
    isActive: true,
    id: true,
})
export type DeleteCourseOutput = z.infer<typeof DeleteCourseResponse>
