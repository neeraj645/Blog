const Router = require('express').Router();
const { registerUser, loginUser, getUserProfile } = require('../controller/userController');
// const protect = require('../middlewares/authMiddleware');
const { verifyToken, verifyAdmin } = require('../middlewares/tokenHandler');

Router.post('/register', registerUser);
Router.post('/login', loginUser);
Router.get('/profile', verifyToken, getUserProfile);

module.exports = Router;