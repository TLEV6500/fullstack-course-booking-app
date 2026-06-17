import User from "../models/User.ts";
import bcrypt from "bcryptjs";
import * as Auth from "../middlewares/auth.ts";
import mongoose from "mongoose";

export const checkEmailExists = async (req, res) => {
    const result = await User.find({ email: req.body.email });
    const emailExists = result.length > 0;
    return res.status(200).send({
        message: emailExists ? "Email exists" : "Email does not exist",
        emailExists,
    });
};

export const registerUser = async (req, res) => {
    if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ message: "Mobile number is invalid" });
    } else if (req.body.password.length < 8) {
        return res
            .status(400)
            .send({ message: "Password must be atleast 8 characters long" });
    } else {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        const result = await newUser.save();
        return res.status(201).send({
            message: "User registered successfully",
            user: result,
        });
    }
};

export const loginUser = async (req, res) => {
    const result = await User.findOne({ email: req.body.email }).lean();

    if (result == null) {
        return res.status(404).send({ message: "No user found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        result.password,
    );

    if (isPasswordCorrect) {
        return res.status(200).send({
            message: "User logged in successfully",
            access: Auth.createAccessToken(result),
        });
    }

    return res.status(401).send({ message: "Incorrect email or password" });
};

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }

    user.password = "";
    return res.status(200).send(user);
};

export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { id } = req.user;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(id, { password: hashedPassword });
    return res.status(200).send({ message: "Password reset successfully" });
};

export const updateProfile = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).send({ message: "Invalid user ID" });
    }
    const userId = req.user.id;

    const { firstName, lastName, mobileNo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, mobileNo },
        { new: true },
    ).lean();

    if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
    }

    updatedUser.password = "";

    return res.status(200).send(updatedUser);
};
