const express = require("express");
const courseController = require("../controllers/course");
const auth = require("../middlewares/auth");
const { create405Handler } = require("../middlewares/error");
const {
    createTextInputValidator,
    createSearchStringValidator,
    validateMobileNumber,
} = require("../middlewares/validation");

const { verifyToken, verifyAdmin } = auth;

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
    courseController.addCourse,
);
router.get("/", courseController.getAllActive);
router.all("/", handleOnlyPostAndGet);

// ROUTE: "/all"
router.get("/all", verifyToken, verifyAdmin, courseController.getAllCourses);
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
    courseController.searchCoursesByName,
);
router.all("/search", handleOnlyPost);

// ROUTE: "/specific/:id"
router.get("/specific/:id", courseController.getCourse);
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
    courseController.updateCourse,
);
router.all("/:courseId", handleOnlyPatch);

// ROUTE: "/:courseId/archive"
router.patch(
    "/:courseId/archive",
    verifyToken,
    verifyAdmin,
    courseController.archiveCourse,
);
router.all("/:courseId/archive", handleOnlyPatch);

// ROUTE: "/:courseId/activate"
router.patch(
    "/:courseId/activate",
    verifyToken,
    verifyAdmin,
    courseController.activateCourse,
);
router.all("/:courseId/activate", handleOnlyPatch);

router.all("*path", create405Handler(["POST", "GET", "PATCH"]));

module.exports = router;
