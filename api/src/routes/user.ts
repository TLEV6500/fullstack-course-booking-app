import express from "express";
import * as UserController from "../controllers/user.ts";
import { verifyToken } from "../middlewares/auth.ts";
import { create405Handler } from "../middlewares/error.ts";
import {
    validateEmailFormat,
    createTextInputValidator,
    validatePasswordFormat,
    validateMobileNumber,
} from "../middlewares/validation.ts";

const router = express.Router();

router.post(
    "/check-email",
    validateEmailFormat,
    UserController.checkEmailExists,
);
router.post(
    "/register",
    createTextInputValidator(
        {
            firstName: { required: true, type: "string" },
            lastName: { required: true, type: "string" },
            password: { required: true, type: "string" },
        },
        false,
    ),
    validatePasswordFormat,
    validateEmailFormat,
    validateMobileNumber,
    UserController.registerUser,
);
router.post(
    "/login",
    createTextInputValidator(
        {
            password: { required: true, type: "string" },
        },
        false,
    ),
    validatePasswordFormat,
    validateEmailFormat,
    validateMobileNumber,
    UserController.loginUser,
);
router.get("/details", verifyToken, UserController.getProfile);
router.post(
    "/reset-password",
    validatePasswordFormat,
    verifyToken,
    UserController.resetPassword,
);
router.put(
    "/profile",
    createTextInputValidator(
        {
            firstName: { required: true, type: "string" },
            lastName: { required: true, type: "string" },
        },
        false,
    ),
    validateMobileNumber,
    verifyToken,
    UserController.updateProfile,
);
router.all("*path", create405Handler(["POST", "GET", "PUT"]));

export default router;
