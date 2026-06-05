const express = require("express");
const enrollmentController = require("../controllers/enrollment");
const auth = require("../auth");

const { verifyToken } = auth;

const router = express.Router();

router.post("/enroll", verifyToken, enrollmentController.enroll);
router.get(
    "/get-enrollments",
    verifyToken,
    enrollmentController.getEnrollments,
);

module.exports = router;
