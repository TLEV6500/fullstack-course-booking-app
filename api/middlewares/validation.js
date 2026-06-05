module.exports.validateEmailFormat = (req, res, next) => {
    if (!req.body.email || !req.body.email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }
    next();
};
