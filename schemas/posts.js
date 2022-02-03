const mongoose = require('mongoose')

const { Schema } = mongoose

const CommentSchema = new Schema({
    text: String,
    publishedDate: {
        type: Date,
        default: Date.now,
    },
})

const postsSchema = new Schema({
    postId: {
        type: Number,
        unique: true,
        required: true,
    },
    postAuthor: {
        type: String,
        required: true,
    },
    postTitle: {
        type: String,
        required: true,
    },
    postContent: {
        type: String,
    },
    postDate: {
        type: String,
    },
    comments: [CommentSchema],
})

module.exports = mongoose.model('posts', postsSchema)
