const jwt = require('jsonwebtoken');


function auth(req, res, next) {
const header = req.headers.authorization || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) return res.status(401).json({ message: 'Not authorized: token missing' });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { id: decoded.id };
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
}


module.exports = auth;