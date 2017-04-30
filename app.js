import Koa from 'koa'
import views from 'koa-views'
import convert from 'koa-convert'
import json from 'koa-json'
import BP from 'koa-bodyparser'
import logger from 'koa-logger'

import index from './routes/index'
const app = new Koa()
const bodyparser = new BP()

// middlewares
app.use(convert(bodyparser))
app.use(convert(json()))
app.use(convert(logger()))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// const db = mongoose.connection
// db.on('error', console.error)
// db.once('open', () => {
//   console.log('connected to mongodb server')
// })

// mongoose.connect('localhost/test')

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(index.routes(), index.allowedMethods())
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx)
})

app.listen(process.env.PORT)

export default app