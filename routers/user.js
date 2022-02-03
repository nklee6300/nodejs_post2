const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../schemas/users')
const authMiddleware = require('../middlewares/auth-middleware')

// 회원가입 라우터
router.post('/users', async (req, res) => {
    console.log(req.body)
    const { nickname, password, password_check } = req.body
    console.log(nickname)
    console.log(password)
    console.log(password_check)
    if (password !== password_check) {
        console.log('패스워드 체크 막힘')
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 일치하지 않습니다.',
        })
        return
    } 
    console.log('existusers 전')

    const existUsers = await User.find({ nickname })
    console.log('existusers 후')

    if (existUsers.length) {
        res.status(400).send({
            errorMessage: '이미 가입된 아이디가 있습니다.',
        })
        return
    }
    if (password.indexOf(nickname)>-1 || password.length < 4) {
        res.status(400).send({
            errorMessage: '비밀번호 4자 이상이며 아이디를 포함하면 안됩니다.',
        })
        return
    }
    if (!nickname.match(/[a-zA-Z0-9]+$/) || nickname.length < 3) {
        res.status(400).send({
            errorMessage:
                '닉네임은 3자 이상이며 알파벳(대소문자), 숫자(0~9)를 포함해야됩니다.',
        })
        return
    }
    const user = new User({ nickname, password })
    console.log('user 세이브 전')
    await user.save()
    console.log('user 세이브 후')
    res.status(201).send({})
})

//로그인 라우터
router.post('/auth', async (req, res) => {
    // console.log(`req.body ${req.body['nickname']}`)
    const { nickname, password } = req.body
    // console.log(`nickname : ${nickname}`)
    const user = await User.findOne({ nickname, password })
    // console.log('/auth post 들어옴 => user')
    // console.log(user)
    if (user == null) {
        res.status(401).send({
            errorMessage: '아이디와 비밀번호를 확인하세요.',
        })
        return
    }
    const token = jwt.sign({ userId: user.userId }, 'my-secret-key')
    console.log(token)
    res.send({
        token,
    })
})

//내 정보 조회 API
router.get('/users/me', authMiddleware, async (req, res) => {
    const { user } = res.locals
    console.log('user/me')
    console.log(res.locals)
    console.log(user)
    res.send({
        ...user,
    })
})

module.exports = router
