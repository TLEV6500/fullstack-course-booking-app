module.exports.logErrors = (err, req, res, next) => {
    console.error(err);
    next(err);
};

module.exports.handleErrors = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err && err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON" });
    }
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
};

module.exports.create405Handler = (supportedMethods, isMiddleware = false) => {
    if (!Array.isArray(supportedMethods))
        throw new Error("supportedMethods must be an array");
    return (req, res, next) => {
        if (!req.method)
            throw new Error(
                "create405Handler should be passed as a route handler, req.method is undefined.",
            );
        if (isMiddleware && supportedMethods.includes(req.method))
            return next();
        res.setHeader("Allow", supportedMethods.join(", "));
        res.status(405).json({
            message: `The ${req.method} method is not supported for this endpoint.`,
        });
    };
};
