import type { ZodOpenApiOperationObject, ZodOpenApiPathsObject } from "zod-openapi";
import {Courses} from "@course-booking/models";

export const getOneOrMoreCoursesOperation: ZodOpenApiOperationObject = {
    parameters: [
        {
            name: "q",
            in: "query",
            description: "Text search term for course title or description",
            required: false
        }
    ],
    responses: {
        "200": {
            description: "Successfully returned course(s)",
            content: {
                "application/json": {
                    schema: Courses.GetCoursesResponse
                }
            }
        }
    }
}
export const createOneOrMoreCoursesOperation: ZodOpenApiOperationObject = {
    requestBody: {
        content: {
            "application/json": {
                schema: Courses.CreateCoursesRequest
            }
        }
    },
    responses: {
        "201": {
            description: "Successfully added course(s)",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        },
        "404": {
            description: "Course not found",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        },
        "409": {
            description: "Duplicate courses found",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        }
    }
}
export const updateCourseOperation: ZodOpenApiOperationObject = {
    parameters: [
        {
            name: "courseId",
            in: "path",
            required: true
        }
    ],
    responses: {
        "200": {
            description: "Successfully updated course",
            content: {
                "application/json": {
                    schema: Courses.UpdateCourseResponse
                }
            }
        },
        "400": {
            description: "Invalid request body",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        },
        "403": {
            description: "Access denied",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        },
        "404": {
            description: "Course not found",
            content: {
                "application/json": {
                    schema: Courses.CreateCoursesErrorResponse
                }
            }
        }
    }
}


export const coursesPaths: ZodOpenApiPathsObject = {
    "/courses": {
        get: getOneOrMoreCoursesOperation,
        post: createOneOrMoreCoursesOperation,
    },
    "/courses/{courseId}": {
        patch: updateCourseOperation
    }
}
