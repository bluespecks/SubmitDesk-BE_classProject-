import jwt from 'jsonwebtoken';

function auth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const splitToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(splitToken, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded; // { userId, role }
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
}

export default auth;
