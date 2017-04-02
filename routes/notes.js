import Router from 'koa-router'
const router = new Router({prefix:'/notes'})

router.get('/', async  (ctx, next) => {
  ctx.state = {
    title: 'koa2 title'
  }
  await ctx.render('index', {
  })
})
.get('/write', async (ctx, next) => {
  await ctx.render('write', {})
})

export default router