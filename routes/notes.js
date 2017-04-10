import Router from 'koa-router'
import Note from '../DB/Note'

const router = new Router({prefix:'/notes'})

router.get('/', async  (ctx, next) => {
  const notes = await Note.find({}).exec()
  notes.forEach((value, index) => {
    console.log(index + ' : ' + value)
  })
  ctx.state = {
    title: 'koa2 title'
  }
  await ctx.render('index', {notes: notes})
})
.get('/write', async (ctx, next) => {
  await ctx.render('write', {})
})
.post('/write', async (ctx, next) => {
  let n = new Note({
    title: ctx.request.body.title,
    contents: ctx.request.body.contents
  })
  n = await n.save()
  await ctx.redirect('/notes')
})

export default router