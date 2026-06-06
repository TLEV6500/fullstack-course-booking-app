const express = require("express");
const userController = require("../controllers/user");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/check-email", userController.checkEmailExists);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verifyToken, userController.getProfile);
router.post("/reset-password", verifyToken, userController.resetPassword);
router.put("/profile", verifyToken, userController.updateProfile);
router.all(create405Handler(["POST", "GET", "PUT"]));

module.exports = router;
