const express = require("express");
const userController = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");
const { create405Handler } = require("../middlewares/error");
const {
    validateEmailFormat,
    createTextInputValidator,
    validatePasswordFormat,
    validateMobileNumber,
} = require("../middlewares/validation");

const router = express.Router();

router.post(
    "/check-email",
    validateEmailFormat,
    userController.checkEmailExists,
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
    userController.registerUser,
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
    userController.loginUser,
);
router.get("/details", verifyToken, userController.getProfile);
router.post(
    "/reset-password",
    validatePasswordFormat,
    verifyToken,
    userController.resetPassword,
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
    userController.updateProfile,
);
router.all("*path", create405Handler(["POST", "GET", "PUT"]));

module.exports = router;
