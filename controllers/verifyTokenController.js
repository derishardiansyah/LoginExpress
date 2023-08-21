import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({
      status: 'error',
      statusCode: 403,
      message: 'No token provided',
    });
  }

  jwt.verify(token, process.env.secretLogin, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Failed to authenticate token',
      });
    }

    req.user = decoded;
    next();
  });
};

export default verifyToken;
