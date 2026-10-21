import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization denied. Token missing or malformed." });
    }
    const token = authHeader.split(" ")[2]
      ? authHeader.split(" ")[1]
      : authHeader.slice(7);

    const secret_key = process.env.JWT_SECRET
    if(!secret_key) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
    try {
      const decoded = jwt.verify(token, secret_key);
      req.user = decoded;
      next();
    } catch (v2) {
      return res.status(401).json({
        message: "Authorization denied. Token is invalid",
      });
    }
  } catch (v1) {
    return res.status(500).json({
      message: "Server internal error while authenticating",
    });
  }
};
