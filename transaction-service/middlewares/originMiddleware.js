// middlewares/originMiddleware.js
const jwt = require('jsonwebtoken');

const originMiddleware = (req, res, next) => {
    const bearerHeader = req.headers['origin'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET_ORIGIN_KEY, (err, decoded) => {
            if (err || decoded.origin !== process.env.ORIGIN) {
                return res.status(403).json({ message: "Invalid origin" });
            } else {
                next();
            }
        });
    } else {
        res.status(401).json({ message: "Origin header required" });
    }
};

module.exports = originMiddleware;