const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

module.exports.verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(403).send({
            auth: "Failed",
            message: "No token provided",
        });
    } else {
        token = token.slice(7, token.length);

        jwt.verify(
            token,
            process.env.JWT_SECRET_KEY,
            function (err, decodedToken) {
                if (err) {
                    return res.status(403).send({
                        auth: "Failed",
                        message: err?.message,
                    });
                } else if (
                    Object.keys(decodedToken).every(
                        (prop) => (decodedToken[prop] ?? true) || true,
                    )
                ) {
                    req.user = decodedToken;
                    next();
                } else
                    return res.status(401).json({
                        message:
                            "The provided JWT token is malformed or its signature is invalid.",
                        info: {
                            decodedToken,
                            allPropsNotUndefined: Object.keys(
                                decodedToken,
                            ).every(
                                (prop) => (decodedToken[prop] ?? true) || true,
                            ),
                        },
                    });
            },
        );
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden",
        });
    }
};
