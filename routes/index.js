import Router from 'koa-router'
import api from './api'
import notes from './notes'
import settings from './settings'

const router = new Router()
router.get('/', async (ctx, next) => {
  // ctx.redirect('/notes')
  await ctx.render('react')
})

router.use(api.routes(), api.allowedMethods())
router.use(notes.routes(), notes.allowedMethods())
router.use(settings.routes(), settings.allowedMethods())

export default router
