const router = require('koa-router')()
let {addUser,patchUser,deleteUser,getUser,getUserList} = require('../controller/userControll')
router.prefix('/users')
router.post('/addUser', addUser)
router.patch('/patchUser', patchUser)
router.delete('/deleteUser', deleteUser)
router.get('/getUser', getUser)
router.get('/getUserList', getUserList)
module.exports = router
