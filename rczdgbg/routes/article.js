const router = require('koa-router')()
let {addArticle,patchArticle,deleteArticle,getArticle,getArticleList} = require('../controller/articleControll')
router.prefix('/articles')
router.post('/addArticle', addArticle)
router.patch('/patchArticle', patchArticle)
router.delete('/deleteArticle', deleteArticle)
router.get('/getArticle', getArticle)
router.get('/getArticleList', getArticleList)
module.exports = router
