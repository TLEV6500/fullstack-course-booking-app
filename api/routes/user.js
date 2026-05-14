const express = require('express');
const userController = require('../controllers/user');
const { verify } = require("../auth");

const router = express.Router();

router.post("/check-email", userController.checkEmailExists);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.post('/reset-password', verify, userController.resetPassword);
router.put('/profile', verify, userController.updateProfile);

module.exports = router;