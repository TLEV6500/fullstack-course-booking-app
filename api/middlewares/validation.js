module.exports.validateEmailFormat = (req, res, next) => {
    if (!req.body.email || !req.body.email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }
    next();
};

module.exports.createTextInputValidator = (inputLabels) => {
    if (Object.keys(inputLabels).length == 0)
        throw new Error(
            "First argument to createTextInputValidator must be be an object{string:boolean} with at least one key corresponding to req.body keys",
        );
    const allRequiredLabels = Object.keys(inputLabels).filter(
        (label) => inputLabels[label],
    );
    return (req, res, next) => {
        const missingRequiredLabels = [];
        for (const label in inputLabels) {
            if (inputLabels[label] && !req.body[label]) {
                missingRequiredLabels.push(label);
            }
        }
        if (missingRequiredLabels.length != 0) {
            return res.status(400).send({
                message: `Missing req.body entries: ${missingRequiredLabels}`,
            });
        }

        const invalidLabels = [];
        let canProceed = true;
        for (const [label, value] of Object.entries(req.body)) {
            if (!(label in inputLabels)) {
                invalidLabels.push(label);
                delete req.body[label];
                continue;
            }
            if (typeof value !== "string" && !/^[\w\s]+$/.test(value)) {
                invalidLabels.push(label);
                if (canProceed) canProceed = false;
            }
        }
        if (invalidLabels.length > 0 && !canProceed) {
            return res.status(400).json({
                message: `Invalid inputs with incorrect formats found: ${invalidLabels};\nAll required: ${allRequiredLabels}`,
            });
        }
        next();
    };
};
