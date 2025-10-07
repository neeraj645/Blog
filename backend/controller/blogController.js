const asyncHandler = require('express-async-handler');
const successHandler = require('../middlewares/successHandler');
const errorHandler = require('../middlewares/errorHandler');
const Blog = require('../model/blogModel');
const { uploadToImageKit, removeFromImageKit } = require("../services/uploadImage");


exports.createBlog = asyncHandler(async (req, res) => {
    const { title, content} = req.body;
    if (!title || !content || (req.file && !req.file.buffer)) {
        return errorHandler({ message: 'Please provide all required fields', statusCode: 400 }, req, res);
    }

    const response = req.file ? await uploadToImageKit(req, "blogs") : null;
    const blog = await Blog.create({
        title,
        content,
        image: {
            url: response ? response.url : null,
            fileId: response ? response.fileId : null
        },
        author:req.user.id
    });

    if (blog) {
        return successHandler(res, blog, 'Blog created successfully', 201);
    } else {
        return errorHandler({ message: 'Invalid blog data', statusCode: 400 }, null, null);
    }
});

exports.getAllBlogs = asyncHandler(async (req, res) => {
    const conditions = {
        // status: true
    };
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const total = await Blog.countDocuments(conditions);
    const blogs = await Blog.find(conditions)
        .populate('author', 'username email')
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .select('-__v -updatedAt')
        ;
    return successHandler(res, blogs, blogs.length ? "Blogs fetched successfully" : "No blog found", 200);
});

exports.getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
        .populate('author', 'username email')
        .select('-__v -createdAt -updatedAt');
    if (blog) {
        return successHandler(res, blog, 'Blog fetched successfully', 200);
    } else {
        return errorHandler({ message: 'Blog not found', statusCode: 404 }, req, res);
    }
});

// incomplete now
exports.updateBlog = asyncHandler(async (req, res) => {
    const { title, content, image } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.image = image || blog.image;

        const updatedBlog = await blog.save();
        return successHandler(res, updatedBlog, 'Blog updated successfully', 200);
    } else {
        return errorHandler({ message: 'Blog not found', statusCode: 404 }, req, res);
    }
});

exports.deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return errorHandler({ message: 'Blog not found', statusCode: 404 }, req, res);
    }
    if (blog.author.toString() !== req.user.id.toString()) {
        return errorHandler({ message: 'You are not authorized to delete this blog', statusCode: 403 }, req, res);
    }
    if (blog) {
        await blog.deleteOne();
        if (blog.image && blog.image.fileId) await removeFromImageKit(blog.image.fileId);
        return successHandler(res, null, 'Blog deleted successfully', 200);
    } else {
        return errorHandler({ message: 'Blog not found', statusCode: 404 }, req, res);
    }
}); 