export const validateEmailFormat = (req, res, next) => {
    if (!req.body?.email || !req.body.email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }
    next();
};

export const createSearchStringValidator = (searchKey) => {
    return (req, res, next) => {
        const searchValue = req.query[searchKey] || req.body[searchKey];
        if (searchValue && /^[^\?][a-zA-Z0-9 .,?!-]*$/.test(searchValue)) {
            next();
        } else {
            return res
                .status(400)
                .send({ message: `Invalid ${searchKey} format` });
        }
    };
};

export const validatePasswordFormat = (req, res, next) => {
    if (
        !(req.body?.password && req.body.password.length > 8) &&
        !(req.body?.newPassword && req.body.newPassword.length > 8)
    ) {
        return res
            .status(400)
            .send({ message: "Password must be at least 8 characters long" });
    }
    next();
};

export const validateMobileNumber = (req, res, next) => {
    const { mobileNo } = req.body;
    if (!mobileNo || !/^(09|\+639)[0-9]{9}$/.test(mobileNo)) {
        return res
            .status(400)
            .send({ message: "Invalid mobile number format" });
    }
    next();
};

// const isCleanString = (value) => {
//     return (
//         typeof value === "string" &&
//         /^[a-zA-Z0-9 .,?!-\u00C0-\u00FF]+$/.test(value)
//     );
// };

export const isValidType = (
    value,
    { type = null, required = false }: any = {},
) => {
    if (value === null || value === undefined) {
        return !required;
    }
    switch (type) {
        case "string":
            return (
                typeof value === "string" &&
                value.trim().length > 0 &&
                /^[a-zA-Z0-9 .,?!-]+$/.test(value)
            );
        case "number":
            return typeof value === "number" && !isNaN(value);
        case "boolean":
            return typeof value === "boolean";
        default:
            return false;
    }
};

export const createTextInputValidator = (
    inputLabels: Record<
        string,
        { type: "string" | "number" | "boolean"; required: boolean }
    >,
    rejectAdditionalProps = true,
) => {
    if (Object.keys(inputLabels).length == 0)
        throw new Error(
            "First argument to createTextInputValidator must be be an object{string:boolean} with at least one key corresponding to req.body keys",
        );
    const allRequiredLabels = Object.keys(inputLabels).filter(
        (label) => inputLabels[label]!.required,
    );
    return (req, res, next) => {
        const missingRequiredLabels: string[] = [];
        for (const label in inputLabels) {
            if (inputLabels[label]!.required && req.body[label] === undefined) {
                missingRequiredLabels.push(label);
            }
        }
        if (missingRequiredLabels.length != 0) {
            return res.status(400).send({
                message: `Missing req.body entries: ${missingRequiredLabels}`,
            });
        }

        const invalidLabels: string[] = [];
        let canProceed = !rejectAdditionalProps;
        for (const [label, value] of Object.entries(req.body)) {
            if (rejectAdditionalProps && !(label in inputLabels)) {
                invalidLabels.push(label);
                delete req.body[label];
                continue;
            }

            if (!isValidType(value, inputLabels[label])) {
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
