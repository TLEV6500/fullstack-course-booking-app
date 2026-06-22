import express from "express";
import * as EnrollmentController from "../controllers/enrollment.ts";
import * as Auth from "../middlewares/auth.ts";
import { create405Handler } from "../middlewares/error.ts";

const { verifyToken } = Auth;

const router = express.Router();

router.post("/enroll", verifyToken, EnrollmentController.enroll);
router.get(
    "/get-enrollments",
    verifyToken,
    EnrollmentController.getEnrollments,
);
router.all("*path", create405Handler(["POST", "GET"]));

export default router;
