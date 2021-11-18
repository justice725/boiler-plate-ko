const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 // 솔트는 비밀번호를 암호화 하는 것, 솔트를 만들기 위해 솔트라운즈를 만든다. 암호화 하기 위한 솔트를 10자리 숫자로 만든다.
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    }, 
    email: {
        type: String,
        trim: true, // 이메일을 쓸 때 빈칸이 있다면 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    role: { // 관리자 권한
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
// 유저 모듈에 정보를 저장하기 전에, 해당 함수를 실행한다.
userSchema.pre('save', function(next){
    // 비밀번호를 암호화 시킨다.
    var user = this;

    if(user.isModified('password')) { // 패스워드를 변경하거나, 생성할 때만 작동
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash ;
                console.log(hash);
                next();// 암호화 한 후 next()로 연결, 유저 모듈에 저장한다.
            });
        });
    } else { // 비밀번호를 바꿀 때가 아니면 그냥 실행시켜준다.
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword -> 12345678 / 암호화된 비밀번호 -> 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    //  => 'secretToken' -> user._id
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function ( token, cb) {
    var user = this;
    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 후,
        // 클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema) // 스키마를 모듈로 감싸기

module.exports = { User } // 이 스키마를 다른 곳에서도 사용할 수 있도록 함