import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).send("Authorization token is required.");
    }

    const tokenParts = authorizationHeader.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(403).send("Invalid token format.");
    }

    const token = tokenParts[1];

    jwt.verify(token, process.env.TOEKNKEY, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token.");
        }

        req.user = decoded;
        next();
    });
};

export default verifyToken;
