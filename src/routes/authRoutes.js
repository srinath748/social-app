const express = require('express');
const { register, login, me } = require('../controllers/authController');  // ✅ fix here
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);  // ✅ use "me"

module.exports = router;
