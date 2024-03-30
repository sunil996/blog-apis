const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        minlength: [10, 'Title must be at least 10 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        enum: ["tech", "study", 'information', 'sports', 'health', 'travel', 'food', 'lifestyle', 'other'],
        required: true,
        index:true
    },
    tags: [String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
