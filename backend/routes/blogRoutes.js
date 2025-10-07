
const router = require('express').Router();
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controller/blogController');
const upload = require('../utils/upload');
const { verifyToken } = require('../middlewares/tokenHandler');

// All routes are protected and only admin can create, update, delete blogs
router.post('/', verifyToken, upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id',verifyToken, upload.single('image'), updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

module.exports = router;
