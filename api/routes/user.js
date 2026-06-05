const express = require("express");
const userController = require("../controllers/user");
const { verifyToken } = require("../auth");

const router = express.Router();

/**
 *  @openapi
 */
router.post("/check-email", userController.checkEmailExists);

/**
 *  @openapi
 */
router.post("/register", userController.registerUser);

/**
 *  @openapi
 */
router.post("/login", userController.loginUser);

/**
 *  @openapi
 */
router.get("/details", verifyToken, userController.getProfile);

/**
 *  @openapi
 */
router.post("/reset-password", verifyToken, userController.resetPassword);

/**
 *  @openapi
 */
router.put("/profile", verifyToken, userController.updateProfile);

module.exports = router;
