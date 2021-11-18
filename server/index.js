const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require("./models/User");
const { auth } = require('./middleware/auth');

// application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
//application/json
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch((e) => console.log('MongoDB error: ', e));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// LandingPage에서 axios로 보낸 요청을 처리한다.
app.get('/api/hello', (req, res) => {
  res.send("axios로 이렇게 프론트에 메세지를 전달합니다.")
})

// register route
app.post('/api/users/register', (req, res) => {
  // 회원가입시 필요한 정보들을 클라이언트에서 가져오면 
  // 그것들을 데이터 베이스에 넣어준다. 

  
  const user = new User(req.body)

  user.save((err, user) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/api/users/login', (req, res) => { // 로그인 요청
  // 요청된 이메일을 데이터 베이스에 있는지 찾는다.
  User.findOne({email:req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false, 
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청한 이메일이 있다면 비밀번호가 같은지 확인한다.
    user.comparePassword(req.body.password , (err, isMatch) => {
        if(!isMatch) // 비밀번호가 틀릴 때
        return res.json({loginSuccess: false, message: "비밀번호가 틀립니다."})

        //비밀번호까지 맞다면 토큰을 생성하기.
        user.generateToken((err, user) => {
          if(err) return res.status(400).send(err);
          // 쿠키, 로컬스토리지, 세션 등에 토큰을 저장한다. 
          // 쿠키에 저장하려면 cookieparser깔아야 된다.
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess:true, userId: user._id })
        })
    })
  })
  
  // 비밀번호까지 맞다면 token을 생성한다. 
})

// auth를 이용해 토큰을 기반으로 해당 작동을 하려는 유저가 데이터베이스에 저장된 것과 같은지 확인한다.
app.get('/api/users/auth', auth , (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 것은,
  // Authentication이 true 라는 말이다. 그렇지 못하면, return된다.
  res.status(200).json({
    _id: req.user.id, // auth에서 req안에 user를 넣었기 때문에 가능
    isAdmin: req.user.role === 0 ? false : true, // 정책을 바꿀 수 있다. 현재는 role이 0이면 - 일반유저, role이 0이 아니면 관리자
    isAuth: true, 
    email: req.user.email,
    name:req.user.name,
    role:req.user.role,
    image:req.user.image
  })
})

// 로그아웃 라우터 만들기 // 로그아웃을 하려는 유저는 위의 auth의 토큰을 지워주면 된다.
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id}, 
    {token:""}
    , (err, user) => {
      if (err) return res.json({success:false, err});
      return res.status(200).send({
        success:true
      })
    })
})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})