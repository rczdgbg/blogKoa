const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const { connectDB } =  require('./mongoose')
const Router = require('koa-router')
const requireDirectory = require('require-directory')

// error handler
onerror(app)
try {
    (async()=> await connectDB())()
} catch (error) {
    console.log(error, '****************错误*************')
}

// middlewares
app.use(koaBody({strict:false,}));
app.use(async (ctx, next) => {
    ctx.params = {
      ...ctx.request.body,
      ...ctx.query
    };
    await next();
});
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// 将所有的路由加载上,自动加载代码
requireDirectory(module, './routes', { visit: whenLoadModule })
function whenLoadModule(obj) {
  if (obj instanceof Router) {
    app.use(obj.routes(), obj.allowedMethods())
  }
}
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
// app.use(tags.routes(), tags.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
