const mongoose = require('mongoose')
const schema = mongoose.Schema
let objectId = schema.Types.ObjectId



// 定义文章schema
const articleSchema = new schema({
    articleId: objectId,
    articleTitle: { unique: true, type: String, required: [true, 'articleTitle不能为空'] }, //文章title
    articleContent: { unique: true, type: String, required: [true, 'articleContent不能为空'] }, // 文章内容
    coverImage: { type: String, type: String, default: "" }, // 封面路径
    tagIds: { type: String, type: String, default: "" },
    abstract: {  type: String, required: [true, 'abstract不能为空'] },
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date, default: Date.now() },
})

//注册模型
let articleModel = mongoose.model('article', articleSchema)
module.exports = articleModel