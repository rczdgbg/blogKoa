/**
 * 校验请求参数
 * @param {object} rules - 规则对象
 * @param {object} value - 数据源.
 * @return {object} 返回校验结果
 */

module.exports = (rules, value) => {
    for (let rule of Object.keys(rules)) {
        for (let func of rules[rule]) {
            let validate = new checkFunc()[func](value[rule], rule)
            if (validate && !validate.check) {
                return validate
            }
        }
    }
    return {
        check: true,
        msg: 'success'
    }
}
class checkFunc {
    isEmpty(v, key) {
        if (v === "" || v === null) {
            return {
                check: false,
                msg: `${key}不能为空`
            }
        }
    }
    isRequire(v, key) {
        if (v === undefined || v === null) {
            return {
                check: false,
                msg: `${key}字段必传`
            }
        }
    }
    isString(v, key) {
        if (v !== undefined && typeof v !== 'string') {
            return {
                check: false,
                msg: `${key}字段必须是字符串`
            }
        }
    }
    isPassword(v, key) {
        if (v.length > 21 && v.length < 6) {
            return {
                check: false,
                msg: '密码长度在6-20之间'
            }
        }
        else if (!/^[0-9|a-z|A-Z||@|$|%|_|\.|\\|\/]{6,20}$/g.test(v)) {
            return {
                check: false,
                msg: '密码只能包含0-9、a-z、A-Z、@、$、%、_、.、/、\\'
            }
        }
    }
    isArray(v,key){
        if(!Array.isArray(v)){
            return {
                check: false,
                msg: `${key}字段必须是数组`
            }
        }
    }
    //数组长度
    isArrayLength(v,key){
        if(!v.length){
            return {
                check: false,
                msg: `${key}不能为空数组`
            }
        }
    }
    isAvatar(v, key) {
        if (v) {
            return {
                check: false,
                msg: '头像格式或者大小不正确'
            }
        }
    }
    isNumber(v,key){
        if(typeof v !== 'number'){
            return {
                check: false,
                msg: `${key}只能是数字`
            }
        }
    }
}