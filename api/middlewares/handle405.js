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
            error: "Method Not Allowed",
            message: `The ${req.method} method is not supported for this endpoint.`,
        });
    };
};
