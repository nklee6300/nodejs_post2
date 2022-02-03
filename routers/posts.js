const express = require('express')
const Posts = require('../schemas/posts') //post 모델 가져오기
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

router.get('/posts', async (req, res, next) => {
    try {
        const posts = await Posts.find({}).sort('-postId')

        res.json({ posts: posts })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    posts = await Posts.findOne({ postId: postId })
    console.log('')
    res.json({ posts: posts })
})
// 포스팅
router.post('/create', authMiddleware, async (req, res) => {
    const postAuthor = res.locals.user['nickname']
    const { postId, postDate, postTitle, postContent } = req.body
    console.log('/create post의 postAuthor')
    console.log(postAuthor)

    await Posts.create({ postId, postDate, postAuthor, postTitle, postContent })

    res.send({ result: 'success' })
})

router.patch('/posts/:postId', authMiddleware, async (req, res) => {
    console.log(req.params)
    const { postId } = req.params
    const { postAuthor, postTitle, postContent } = req.body
    const exist_post = await Posts.find({ postId })
    console.log(exist_post)
    if (exist_post.length > 0) {
        await Posts.updateOne(
            { postId },
            { $set: { postAuthor, postTitle, postContent } }
        )
    }
    res.send({ result: 'success' })
})

router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params

    const deletePost = await Posts.find({ postId })
    if (deletePost.length > 0) {
        await Posts.deleteOne({ postId })
    }
    res.send({ result: 'success' })
})

module.exports = router
