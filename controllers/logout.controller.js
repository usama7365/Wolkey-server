const jwt = require('jsonwebtoken');

const logout = (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }


  return res.json({ message: 'Logged out successfully' });
};

module.exports = { logout };
