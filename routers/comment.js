const express = require('express')
const router = express.Router() //라우터라고 선언한다.
const url = require('url')
const Comment = require('../schemas/comment')
const authMiddleware = require('../middlewares/auth-middleware')

//해당 포스트의 모든 댓글 조회
router.get('/Allcomment/:postId', authMiddleware, async (req, res, next) => {
    try {
        const { postId } = req.params
        let comments = await Comment.find({ postId }).sort('-date').lean()
        for (let i = 0; i < comments.length; i++) {
            if (
                res.locals.user != null &&
                comments[i]['author'] == res.locals['user']['nickname']
            ) {
                comments[i]['mine'] = true
            } else comments[i]['mine'] = false
        }
        res.json({ comments: comments })
    } catch (err) {
        console.error(err)
        next(err)
    }
})

//댓글 한개 조회
router.get('/comment/:commentId', async (req, res) => {
    const { commentId } = req.params
    comment = await Comment.findOne({ commentId })
    res.json({ detail: comment })
})

//댓글 게시
router.post('/comment', authMiddleware, async (req, res) => {
    const recentComment = await Comment.find().sort('-commentId').limit(1)
    let commentId = 1
    if (recentComment.length != 0) {
        commentId = recentComment[0]['commentId'] + 1
    }
    const author = res.locals['user']['nickname']
    const { postId, content } = req.body
    const date = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
    await Comment.create({ commentId, postId, content, author, date })
    res.redirect(req.get('referer'))
})


//댓글 삭제
router.delete('/comment/:commentId', async (req, res) => {
    const { commentId } = req.params
    await Comment.deleteOne({ commentId })
    res.send({ result: 'success' })
})

//댓글 수정
router.patch('/comment/', async (req, res) => {
    const { content, commentId } = req.body
    await Comment.updateOne({ commentId }, { $set: { content } })
    res.send({ result: 'success' })
})

module.exports = router 

