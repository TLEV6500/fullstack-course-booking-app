module.exports.logErrors = (err, req, res, next) => {
    console.error(err);
    next(err);
};
