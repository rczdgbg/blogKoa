const tagModel = require('../schema/tag')
const check = require('../Untils/checkRequest')

/**
 * 新增标签
 */
exports.addTag = async (ctx) => {
    const rules = {
        tagName: ['isRequire', 'isEmpty', 'isString'],
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
        let find = await tagModel.findOne({
            tagName: req.tagName
        })
        if (find) {
            ctx.body = {
                code: 0,
                message: `${find.tagName}标签已存在！`
            }
        } else {
            let newTag = new tagModel(req)
            await newTag.save()
            ctx.body = {
                code: 1,
                message: "新增成功！"
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
 * 编辑标签 
 */
exports.patchTag = async (ctx) => {
    const rules = {
        _id: ['isRequire', 'isString'],
        tagName: ['isRequire', 'isEmpty', 'isString'],
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
        let updates = {
            $set: {
                tagName: req.tagName,
                updateAt: Date.now()
            }
        }
        await tagModel.update(
            {
                _id: req._id
            },
            updates
        )
        ctx.body = {
            code: 1,
            message: "修改成功！"
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(err.message)
        }
    }
}

/**
 * 删除标签 支持多个
 * @param {array} ids
 */
exports.deleteTag = async (ctx) => {
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
        await tagModel.remove({ _id: { $in: req.ids } })
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
 * 查看标签详情 需要权限 
 * @param {string} _id
 */
exports.getTag = async (ctx) => {
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
        let find = await tagModel.findOne({
            _id: req._id
        },{__v: 0})
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
 * 查看标签列表 
 * @param {string} _id
 * @param {string} tagName
 * @param {string} account
 */
exports.getTagList = async (ctx) => {
    const rules = {
        _id: ['isString'],
        tagName: ['isString'],
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
    const { page = 1, pageSize = 10, tagName = '', _id = '' } = ctx.params
    try {
        let query = {}
        if(_id){
            query['_id'] = _id
        }
        if(tagName){
            query['tagName'] = { $regex: new RegExp(tagName, 'i')}
        }
        let total = await tagModel.count(query)
        let find = await tagModel.find(query, {__v: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ 'createAt': -1 })
        ctx.body = {
            code: 1,
            message: "查询成功！",
            data: find,
            total,
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}

/**
 * 查看所有标签列表 
 * @param {string} _id
 */
exports.getAllTagList = async (ctx) => {
    try {
        let find = await tagModel.find({}, {__v: 0})
            .sort({ 'createAt': -1 })
            ctx.body =  {
            code: 1,
            message: "查询成功！",
            data: find,
            total,
        }
    } catch (err) {
        ctx.body =  {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}

/**
 * 查询标签 内部查询
 * @param {string} _id
 */
exports.getAllTag= async (req) => {
    const rules = {
        ids: ['isRequire', 'isString', 'isEmpty'],
    }
    let validate = check(rules, req)
    if (!validate.check) {
        return {
            code: 2,
            message: validate.msg
        }
    }
    try {
        let find = await tagModel.find({ _id: { $in: req.ids.split(',') }}, {__v: 0})
            .sort({ 'createAt': -1 })
            return {
            code: 1,
            message: "查询成功！",
            data: find,
        }
    } catch (err) {
        return  {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}