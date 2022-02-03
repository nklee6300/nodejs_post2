const express = require("express");
const connect = require("./schemas");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken')
const authMiddleware = require('./middlewares/auth-middleware')

connect();

const postsRouter = require('./routers/posts')
const userRouter = require('./routers/user')
const commentRouter = require('./routers/comment')
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, "-", new Date());
    next();
};


app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);

app.use('/api', express.urlencoded({ extended: false }), postsRouter);
app.use('/api', express.urlencoded({ extended: false }), userRouter);
app.use('/api', express.urlencoded({ extended: false }), commentRouter);


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});