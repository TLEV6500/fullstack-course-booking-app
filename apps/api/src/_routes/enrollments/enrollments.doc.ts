import type { ZodOpenApiOperationObject, ZodOpenApiPathsObject } from "zod-openapi";
import {  Enrollments } from "@course-booking/models"

export const enrollInCourseOperation: ZodOpenApiOperationObject = {
    requestBody: {
        content: {
            "application/json": {
                schema: Enrollments.EnrollmentRequest
            }
        }
    },
    responses: {
        "201": {
            description: "Successfully enrolled in course",
            content: {
                "application/json": {
                    schema: Enrollments.EnrollmentResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Enrollments.EnrollmentErrorResponse
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Enrollments.EnrollmentErrorResponse
                }
            }
        },
    }
}
export const getEnrolledCoursesOperation: ZodOpenApiOperationObject = {
    requestParams: {
        query: z.object({
            limit: z.number().optional()
                .meta({ id: "limitParam" }),
            expand: z.array(z.enum(["user", "courses"]))
                .meta({
                    id: "expandParam",
                    explode: false,
                    style: "form"
                })
        })
    },
    responses: {
        "200": {
            description: "Successfully retrieved courses enrolled",
            content: {
                "application/json": {
                    schema: z.union([Enrollments.GetEnrollmentsSimpleResponse, Enrollments.GetEnrollmentsExpandedResponse])
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Enrollments.GetEnrollmentsErrorResponse
                }
            }
        },
    }
}

export const enrollmentsPaths: ZodOpenApiPathsObject = {
    "/enrollments": {
        post: enrollInCourseOperation,
        get: getEnrolledCoursesOperation
    }
}
