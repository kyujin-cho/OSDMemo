import Router from 'koa-router'
const router = new Router({prefix: '/settings'})

router.get('/', async (ctx, next) => {
  await ctx.render('settings', {})
})

export default router