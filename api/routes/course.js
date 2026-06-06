const express = require("express");
const courseController = require("../controllers/course");
const auth = require("../middlewares/auth");
const { create405Handler } = require("../middlewares/handle405");

const { verifyToken, verifyAdmin } = auth;

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, courseController.addCourse);
router.get("/all", verifyToken, verifyAdmin, courseController.getAllCourses);
router.get("/", courseController.getAllActive);
router.get("/specific/:id", courseController.getCourse);
router.patch(
    "/:courseId",
    verifyToken,
    verifyAdmin,
    courseController.updateCourse,
);
router.patch(
    "/:courseId/archive",
    verifyToken,
    verifyAdmin,
    courseController.archiveCourse,
);
router.patch(
    "/:courseId/activate",
    verifyToken,
    verifyAdmin,
    courseController.activateCourse,
);
router.post("/search", courseController.searchCoursesByName);
router.all(create405Handler(["POST", "GET", "PATCH"]));

module.exports = router;
