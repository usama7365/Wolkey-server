const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;

    console.log('Decoded token:', decoded); 

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
};
