const mongoose = require('mongoose');

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
        minlength: 8
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

const User = mongoose.model('User', userSchema) // 스키마를 모듈로 감싸기

module.exports = { User } // 이 스키마를 다른 곳에서도 사용할 수 있도록 함