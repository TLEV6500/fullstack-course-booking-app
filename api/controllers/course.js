const Course = require("../models/Course");
const { errorHandler } = require('../auth');

module.exports.addCourse = (req, res) => {

    let newCourse = new Course({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Course.findOne({ name: req.body.name })
    .then(existingCourse => { 

        if (existingCourse) {

            return res.status(409).send({ message: 'Course already exists' });

        } else {

            return newCourse.save()
            .then(result => res.status(201).send({ 
                success: true,
                message: 'Course added successfully', 
                result: result 
            }))
            .catch(error => errorHandler(error, req, res));
        }
    })
    .catch(error => errorHandler(error, req, res));
}

module.exports.getAllCourses = (req, res) => {

    return Course.find({})
    .then(result => {
        
        if(result.length > 0) {

            return res.status(200).send(result);

        } else {

            return res.status(404).send({ message: 'No courses found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {

    Course.find({ isActive: true })
    .then(result => {

        if (result.length > 0) {

            return res.status(200).send(result);

        } else {

            return res.status(200).send({ message: 'No active courses found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getCourse = (req, res) => {

    Course.findById(req.params.id)
    .then(course => {
        if(course) {

            return res.status(200).send(course);

        } else {

            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(err => err);
};

module.exports.updateCourse = (req, res)=>{

    let updatedCourse = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
    .then(course => {
        
        if (course) {

            res.status(200).send({ success: true, message: 'Course updated successfully' });

        } else {

            res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(course => {
        
        if (course) {
 
            if (!course.isActive) {
                return res.status(200).send({ 
                    message: 'Course already archived',
                    course: course
                });
            }

            return res.status(200).send({ 
                success: true, 
                message: 'Course archived successfully'
            });

        } else {

            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.activateCourse = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(course => {
        
        if (course) {

            if (course.isActive) {
                return res.status(200).send({ 
                    message: 'Course already activated', 
                    course: course
                });
            }

            return res.status(200).send({
                success: true,
                message: 'Course activated successfully'
            });

        } else {

            return res.status(404).send({ message: 'Course not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.searchCoursesByName = (req, res) => {

    const { courseName } = req.body;

    Course.find({ name: { $regex: courseName, $options: 'i' } })
    .then(courses => res.status(200).send(courses))
    .catch(error => errorHandler(error, req, res));
};