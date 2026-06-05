const express = require("express");
const userController = require("../controllers/user");
const { verify } = require("../auth");

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
router.get("/details", verify, userController.getProfile);

/**
 *  @openapi
 */
router.post("/reset-password", verify, userController.resetPassword);

/**
 *  @openapi
 */
router.put("/profile", verify, userController.updateProfile);

module.exports = router;
