const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const successHandler = require('../middlewares/successHandler');
const errorHandler = require('../middlewares/errorHandler');

// Register a new user
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return errorHandler({ message: 'Please provide all required fields', statusCode: 400 }, req, res);
    }

    const userExists = await User.findOne({ email });

    // if (userExists) {
    //     return errorHandler({ message: 'Email already in use', statusCode: 400 }, req, res);
    // }
    // const usernameExists = await User.findOne({ username });
    // if (usernameExists) {
    //     return errorHandler({ message: 'Username already in use', statusCode: 400 }, req, res);
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return successHandler(res, { token }, 'User registered successfully', 201);
    } else {
        return errorHandler({ message: 'Invalid user data', statusCode: 400 }, req, res);
    }
});

// Login user
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log( req.body);
    if (!email || !password) {
        return errorHandler({ message: 'Please provide email and password', statusCode: 400 }, req, res);
    }

    const user = await User.findOne({ email });
    // console.log(user);
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return successHandler(res, { token }, 'User logged in successfully', 200);
    } else {
        return errorHandler({ message: 'Invalid email or password', statusCode: 401 }, req, res);
    }
});

// Get user profile
exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password -updatedAt -__v');
    if (user) {
        return successHandler(res, user, 'User profile fetched successfully', 200);
    } else {
        return errorHandler({ message: 'User not found', statusCode: 404 }, req, res);
    }
});