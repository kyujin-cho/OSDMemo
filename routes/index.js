import Router from 'koa-router'
import api from './api'

const router = new Router()
router.get('/', async (ctx, next) => {
  // ctx.redirect('/notes')
  await ctx.render('react')
})

router.use(api.routes(), api.allowedMethods())
export default router
