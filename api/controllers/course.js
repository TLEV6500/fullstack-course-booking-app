const Course = require("../models/Course");

module.exports.addCourse = async (req, res) => {
    let newCourse = new Course({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    });

    const existingCourse = await Course.findOne({ name: req.body.name });

    if (existingCourse) {
        return res.status(409).send({ message: "Course already exists" });
    }

    const result = await newCourse.save();

    return res.status(201).send({
        success: true,
        message: "Course added successfully",
        result: result,
    });
};

module.exports.getAllCourses = async (req, res) => {
    const result = await Course.find({});
    if (result.length > 0) {
        return res.status(200).send(result);
    } else {
        return res.status(404).send({ message: "No courses found" });
    }
};

module.exports.getAllActive = async (req, res) => {
    const result = await Course.find({ isActive: true });
    if (result.length > 0) {
        return res.status(200).send(result);
    } else {
        return res.status(200).send({ message: "No active courses found" });
    }
};

module.exports.getCourse = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid course id format." });
    }
    const course = await Course.findById(req.params.id);
    if (course) {
        return res.status(200).json(course);
    } else {
        return res.status(404).json({ message: "Course not found" });
    }
};

module.exports.updateCourse = async (req, res) => {
    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
    };

    const course = await Course.findByIdAndUpdate(
        req.params.courseId,
        updatedCourse,
    );
    if (course) {
        return res.status(200).send({
            success: true,
            message: "Course updated successfully",
        });
    } else {
        return res.status(404).send({ message: "Course not found" });
    }
};

module.exports.archiveCourse = async (req, res) => {
    let updateActiveField = {
        isActive: false,
    };

    const course = await Course.findByIdAndUpdate(
        req.params.courseId,
        updateActiveField,
    );
    if (course) {
        return res.status(200).send({
            message: !course.isActive
                ? "Course already archived"
                : "Course archived successfully",
            course,
        });
    } else {
        return res.status(404).send({ message: "Course not found" });
    }
};

module.exports.activateCourse = async (req, res) => {
    let updateActiveField = {
        isActive: true,
    };

    const course = await Course.findByIdAndUpdate(
        req.params.courseId,
        updateActiveField,
    );
    if (course) {
        return res.status(200).send({
            message: course.isActive
                ? "Course already activated"
                : "Course activated successfully",
            course,
        });
    } else {
        return res.status(404).send({ message: "Course not found" });
    }
};

module.exports.searchCoursesByName = async (req, res) => {
    const { courseName } = req.body;

    const courses = await Course.find({
        name: { $regex: courseName, $options: "i" },
    });
    return res.status(200).json(courses);
};
