const articleModel = require('../schema/article')
const check = require('../Untils/checkRequest')
const { getAllTag } = require('./tagControll')
/**
 * 新增文章
 */
exports.addArticle = async (ctx) => {
    const rules = {
        abstract: ['isRequire', 'isEmpty', 'isString'],
        articleTitle: ['isRequire', 'isEmpty', 'isString'],
        articleContent: ['isRequire', 'isEmpty', 'isString'],
        coverImage: ['isString'],
        tagIds: ['isString']
    }
    let req = ctx.params
    let validate = check(rules, req)
    if (!validate.check) {
        ctx.body = {
            code: 2,
            message: validate.msg
        }
        return
    }
    try {
        let find = await articleModel.findOne({
            $or: [
                { articleTitle: req.articleTitle }, { articleContent: req.articleContent }
            ]
        })
        if (find) {
            ctx.body = {
                code: 0,
                message: `${find.articleTitle}或内容已存在！`
            }
        } else {
            let {
                abstract,
                articleTitle,
                articleContent,
                tagIds,
                coverImage = ""
            } = req
            let newArticle = new articleModel({
                abstract,
                articleTitle,
                articleContent,
                coverImage,
                tagIds
            })
            await newArticle.save()
            ctx.body = {
                code: 1,
                message: "新增成功！",
            }
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(err.message)
        }
    }
}

/**
 * 编辑文章 
 */
exports.patchArticle = async (ctx) => {
    const rules = {
        _id: ['isRequire', 'isString'],
        abstract: ['isRequire', 'isEmpty', 'isString'],
        articleTitle: ['isRequire', 'isEmpty', 'isString'],
        articleContent: ['isRequire', 'isEmpty', 'isString'],
        coverImage: ['isString'],
        tagIds: ['isString']
    }
    let req = ctx.params
    let validate = check(rules, req)
    if (!validate.check) {
        ctx.body = {
            code: 2,
            message: validate.msg
        }
        return
    }
    try {
        let find = await articleModel.findOne({
            articleTitle: req.articleTitle
        })
        if (find) {
            ctx.body = {
                code: 0,
                message: `${find.articleTitle}已存在！`
            }
        } else {
            let { abstract = "", articleTitle = "", articleContent = "", coverImage = "", tagIds = "", _id } = req

            let updates = {
                $set: {
                    abstract,
                    articleTitle,
                    articleContent,
                    coverImage,
                    tagIds,
                    updateAt: Date.now()
                }
            }
            await articleModel.update(
                {
                    _id: req._id
                },
                updates
            )
            ctx.body = {
                code: 1,
                message: "修改成功！"
            }

        }

    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(err.message)
        }
    }
}

/**
 * 删除文章 支持多个
 * @param {array} ids
 */
exports.deleteArticle = async (ctx) => {
    const rules = {
        ids: ['isRequire', 'isArray', 'isArrayLength'],
    }
    let req = ctx.params
    let validate = check(rules, req)
    if (!validate.check) {
        ctx.body = {
            code: 2,
            message: validate.msg
        }
        return
    }
    try {
        await articleModel.remove({ _id: { $in: req.ids } })
        ctx.body = {
            code: 1,
            message: "删除成功！"
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(err.message)
        }
    }
}

/**
 * 查看文章详情 
 * @param {string} _id
 */
exports.getArticle = async (ctx) => {
    const rules = {
        _id: ['isRequire', 'isString', 'isEmpty'],
    }
    let req = ctx.params
    let validate = check(rules, req)
    if (!validate.check) {
        ctx.body = {
            code: 2,
            message: validate.msg
        }
        return
    }
    try {
        let find = (await articleModel.findOne({
            _id: req._id
        }, { __v: 0, password: 0 })).toObject()
        // let tags = await getAllTag({
        //     ids: find.tagIds
        // })
        // find["tagsName"]= tags.data.map(item=>item.tagName).join(',')
        // if(tags.code !== 1){
        //     ctx.body = tags
        // }
        ctx.body = {
            code: 1,
            message: "查询成功！",
            data: find
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}
/**
 * 查看文章列表 
 * @param {string} articleTitle
 * @param {string} tagIds
 */
exports.getArticleList = async (ctx) => {
    const rules = {
        articleTitle: ['isString'],
        tagIds: ['isString'],
        page: ['isRequire', "isNumber"],
        pageSize: ['isRequire', "isNumber"],
    }
    let validate = check(rules, ctx.params)
    if (!validate.check) {
        ctx.body = {
            code: 2,
            message: validate.msg
        }
        return
    }
    const { page = 1, pageSize = 10, articleTitle = '', tagIds = '' } = ctx.params

    try {
        let query = {}
        if (articleTitle) {
            query['articleTitle'] = { $regex: new RegExp(articleTitle, 'i') }
        }
        if (tagIds) {
            query['tagIds'] = { $regex: new RegExp(tagIds, 'i') }
        }
        let total = await articleModel.count(query)
        let find = (await articleModel.find(query, { __v: 0, })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ 'createAt': -1 }))
        let findData = JSON.parse(JSON.stringify(find))
        for (let item of findData) {

            let tags = await getAllTag({
                ids: item.tagIds
            })
            if (tags.code !== 1) {
                ctx.body = tags
            } else {
                item["tagsName"] = tags.data.map(item => item.tagName).join(',')
            }
        }
        ctx.body = {
            code: 1,
            message: "查询成功！",
            data: findData,
            total,
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}