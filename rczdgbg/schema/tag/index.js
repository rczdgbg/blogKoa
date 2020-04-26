const mongoose = require('mongoose')
const schema = mongoose.Schema
let objectId = schema.Types.ObjectId



// 定义标签schema
const tagSchema = new schema({
    tagId: objectId,
    tagName: { unique: true, type: String, required: [true, 'tagTitle不能为空'] }, //标签名字
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
})

//注册模型
let tagModel = mongoose.model('tag', tagSchema)
module.exports = tagModel