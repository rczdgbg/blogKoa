const mongoose = require('mongoose')
const schema = mongoose.Schema
const bcryt = require('bcryptjs'); // 引入bcrypt模块
const SALT_WORK_FACTOR = 10; // 定义加密密码计算强度
let objectId = schema.Types.ObjectId



// 定义用户schema
const userSchema = new schema({
    userId: objectId,
    userName: { unique: true,type: String, default: "" }, // 昵称
    account: { unique: true, type: String, required: [true, 'account不能为空'] }, //账户
    password: { type: String, required: [true, 'userPassWord不能为空'] }, // 密码
    createAt: { type: Date,default: Date.now() },
    updateAt: {type: Date, default: Date.now() },
    lastLoginAt: { type: Date,default: Date.now() },
    avatar: { type: String, type: String, default: "" }, //头像
})

userSchema.pre('save', function (next) {
    bcryt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)
        bcryt.hash(this.password, salt, (err, hash) => {
            console.log(err)
            if (err) return next(err)
            this.password = hash
            next()
        })
    })
})

//注册模型
let userModel = mongoose.model('user', userSchema)
module.exports = userModel