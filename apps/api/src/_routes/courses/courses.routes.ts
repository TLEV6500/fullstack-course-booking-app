import express from "express";
import * as CourseController from "../controllers/course.ts";
import * as Auth from "../middlewares/auth.ts";
import { create405Handler } from "../middlewares/error.ts";
import {
    createTextInputValidator,
    createSearchStringValidator,
} from "../middlewares/validation.ts";

const { verifyToken, verifyAdmin } = Auth;

const router = express.Router();

const handleOnlyPostAndGet = create405Handler(["POST", "GET"]);
const handleOnlyGet = create405Handler(["GET"]);
const handleOnlyPatch = create405Handler(["PATCH"]);
const handleOnlyPost = create405Handler(["POST"]);

// ROUTE: "/"
router.post(
    "/",
    createTextInputValidator(
        {
            name: { required: true, type: "string" },
            description: { required: true, type: "string" },
            price: { required: true, type: "number" },
            isActive: { required: false, type: "boolean" },
            createdOn: { required: false, type: "string" },
        },
        false,
    ),
    verifyToken,
    verifyAdmin,
    CourseController.addCourse,
);
router.get("/", CourseController.getAllActive);
router.all("/", handleOnlyPostAndGet);

// ROUTE: "/all"
router.get("/all", verifyToken, verifyAdmin, CourseController.getAllCourses);
router.all("/all", handleOnlyGet);

// ROUTE: "/search"
router.post(
    "/search",
    createTextInputValidator(
        {
            courseName: { required: true, type: "string" },
        },
        false,
    ),
    createSearchStringValidator("courseName"),
    CourseController.searchCoursesByName,
);
router.all("/search", handleOnlyPost);

// ROUTE: "/specific/:id"
router.get("/specific/:id", CourseController.getCourse);
router.all("/specific/:id", handleOnlyGet);

// ROUTE: "/:courseId"
router.patch(
    "/:courseId",
    createTextInputValidator(
        {
            name: { required: false, type: "string" },
            description: { required: false, type: "string" },
            price: { required: false, type: "number" },
        },
        false,
    ),
    verifyToken,
    verifyAdmin,
    CourseController.updateCourse,
);
router.all("/:courseId", handleOnlyPatch);

// ROUTE: "/:courseId/archive"
router.patch(
    "/:courseId/archive",
    verifyToken,
    verifyAdmin,
    CourseController.archiveCourse,
);
router.all("/:courseId/archive", handleOnlyPatch);

// ROUTE: "/:courseId/activate"
router.patch(
    "/:courseId/activate",
    verifyToken,
    verifyAdmin,
    CourseController.activateCourse,
);
router.all("/:courseId/activate", handleOnlyPatch);

router.all("*path", create405Handler(["POST", "GET", "PATCH"]));

export default router;
