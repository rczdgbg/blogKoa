const userModel = require('../schema/user')
const check = require('../Untils/checkRequest')

/**
 * 新增用户
 */
exports.addUser = async (ctx) => {
    const rules = {
        userName: ['isString'],
        account: ['isRequire', 'isEmpty', 'isString'],
        password: ['isRequire', 'isEmpty', 'isString', 'isPassword'],
        avatar: ['isAvatar']
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
        let find = await userModel.findOne({
            account: req.account
        })
        if (find) {
            ctx.body = {
                code: 0,
                message: `${find.account}用户已存在！`
            }
        } else {
            //默认昵称账号名
            if (!req.userName) {
                req.userName = req.account
            }
            let newUser = new userModel(req)
            await newUser.save()
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
 * 编辑用户 需要权限
 */
exports.patchUser = async (ctx) => {
    const rules = {
        _id: ['isRequire', 'isString'],
        userName: ['isString'],
        password: ['isString', 'isPassword'],
        avatar: ['isAvatar']
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
        let updateDate = JSON.parse(JSON.stringify(req))
        delete updateDate._id
        if (updateDate.account) delete updateDate.account
        let updates = {
            $set: {
                ...updateDate,
                updateAt: Date.now()
            }
        }
        await userModel.update(
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
 * 删除用户 需要权限 支持多个
 * @param {array} ids
 */
exports.deleteUser = async (ctx) => {
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
        await userModel.remove({ _id: { $in: req.ids } })
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
 * 查看用户详情 需要权限 
 * @param {string} _id
 */
exports.getUser = async (ctx) => {
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
        let find = await userModel.findOne({
            _id: req._id
        })
        let { userName, createAt, updateAt, lastLoginAt, avatar, _id, account } = find || {}
        ctx.body = {
            code: 1,
            message: "查询成功！",
            data: { userName, createAt, updateAt, lastLoginAt, avatar, _id, account }
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}
/**
 * 查看用户列表 
 * @param {string} _id
 * @param {string} userName
 * @param {string} account
 */
exports.getUserList = async (ctx) => {
    const rules = {
        _id: ['isString'],
        userName: ['isString'],
        account: ['isString'],
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
    const { page = 1, pageSize = 10, account = '', userName = '', _id = '' } = ctx.params
    try {
        let query = {}
        if(_id){
            query['_id'] = _id
        }
        if(account){
            query['account'] = { $regex: new RegExp(account, 'i')}
        }
        if(userName){
            query['userName'] = { $regex: new RegExp(userName, 'i')}
        }
        let total = await userModel.count(query)
        let find = await userModel.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ 'createAt': -1 })
        let userList = []
        find.forEach(item => {
            let { userName, createAt, updateAt, lastLoginAt, avatar, _id, account } = item
            userList.push({
                userName, createAt, updateAt, lastLoginAt, avatar, _id, account
            })
        })
        ctx.body = {
            code: 1,
            message: "查询成功！",
            data: userList,
            total,
        }
    } catch (err) {
        ctx.body = {
            code: 0,
            message: JSON.stringify(`查询失败：${err.message}`)
        }
    }
}