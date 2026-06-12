const Enrollment = require("../models/Enrollment");

module.exports.enroll = async (req, res) => {
    if (req.user.isAdmin) {
        return res.status(403).send({ message: "Admin cannot enroll" });
    }

    let newEnrollment = new Enrollment({
        userId: req.user.id,
        enrolledCourses: req.body.enrolledCourses,
        totalPrice: req.body.totalPrice,
    });

    await newEnrollment.save();

    return res.status(201).send({
        success: true,
        message: "Enrolled successfully",
    });
};

module.exports.getEnrollments = async (req, res) => {
    const enrollments = await Enrollment.find({ userId: req.user.id }).lean();

    if (enrollments.length > 0) {
        return res.status(200).send(enrollments);
    }

    return res.status(404).send({ message: "No enrolled courses" });
};
