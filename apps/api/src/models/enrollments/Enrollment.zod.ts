import * as z from "zod"
import { User } from "../users/User.zod.ts"
import { Course } from "../courses/Course.zod.ts"

// Note: Convert this User<1:1>Enrollment<1:n>Course relationship to a User<1:n>Enrollment<1:1>Course and User<1:n>Transaction<1:n>Enrollment relationships in the future
export const Enrollment = z.object({
    userId: z.string().min(1),
    enrolledCourses: z.array(z.string().min(1)),
    totalPrice: z.number().nonnegative(),
    enrolledOn: z.date(),
    status: z.string().min(1),
    id: z.string().min(1),
})
export type Enrollment = z.infer<typeof Enrollment>

export const EnrollmentRequest = z.object({
    courseId: z.string().min(1),
    userId: z.string().min(1),
})
export type EnrollmentInput = z.infer<typeof EnrollmentRequest>

export const EnrollmentResponse = z.object({
    enrollmentId: Enrollment.shape.id,
    userId: Enrollment.shape.userId
})
export type EnrollmentOutput = z.infer<typeof EnrollmentResponse>

const ExpandUserOrCourseQueryEnum = z.enum(["user", "courses"])
export const GetEnrollmentQueryParams = z.object({
    limit: z.coerce.number().nonnegative().default(10).optional(),
    offset: z.coerce.number().nonnegative().default(0).optional(),
    expand: ExpandUserOrCourseQueryEnum.optional(),
})
export type GetEnrollmentInput = z.infer<typeof GetEnrollmentQueryParams>

export const GetEnrollmentsBaseResponse = z.object({
    enrollmentId: Enrollment.shape.id,
})

export const GetEnrollmentsSimpleResponse = GetEnrollmentsBaseResponse.safeExtend({
    expanded: z.literal(false),
    userId: Enrollment.shape.userId,
    enrolledCourses: Enrollment.shape.enrolledCourses
})

export const GetEnrollmentsExpandedResponse = GetEnrollmentsBaseResponse.safeExtend({
    expanded: ExpandUserOrCourseQueryEnum,
    user: User.pick({
        id: true,
        firstName: true,
        lastName: true,
    }).optional(),
    courses: z.array(Course.omit({
        createdOn: true,
        lastUpdatedOn: true,
        isActive: true,
    })).optional(),
})

export const GetEnrollmentsResponse = z.discriminatedUnion("expanded",[
    GetEnrollmentsSimpleResponse,
    GetEnrollmentsExpandedResponse,
])

export type GetEnrollmentsOutput = z.infer<typeof GetEnrollmentsResponse>
