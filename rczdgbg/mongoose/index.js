const mongoose = require('mongoose')
const config = require('../config')

exports.connectDB = () => {
    return new Promise((reslove, reject) => {
        // 链接数据库

        mongoose.connect(config.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        // 数据库断开
        mongoose.connection.on('disconnected', () => {
            console.log('****************数据库断开*************')
            reject()
            throw new Error('数据库出现问题')
        })
        // 数据库错误
        mongoose.connection.on('error', () => {
            console.log('****************数据库错误***********')
            reject()
            throw new Error('数据库出现问题')
        })
        mongoose.connection.once('open', () => {
            console.log('****************数据库链接成功***********');
            reslove()
        })
    })
}