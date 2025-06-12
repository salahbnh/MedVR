import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing JWT token' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId; // Assuming your JWT payload includes a userId field
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid JWT token' });
  }
};
