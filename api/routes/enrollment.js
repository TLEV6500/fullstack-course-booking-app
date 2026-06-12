const express = require("express");
const enrollmentController = require("../controllers/enrollment");
const auth = require("../middlewares/auth");
const { create405Handler } = require("../middlewares/error");

const { verifyToken } = auth;

const router = express.Router();

router.post("/enroll", verifyToken, enrollmentController.enroll);
router.get(
    "/get-enrollments",
    verifyToken,
    enrollmentController.getEnrollments,
);
router.all("*path", create405Handler(["POST", "GET"]));

module.exports = router;
