import Router from 'koa-router'
import Notes from '../../DB/Note'
import controller_settings from './settings.controller'

const router = new Router({prefix: '/api'})

export async function getNotes(ctx, next) {
  const notes = await Notes.find({}).exec()
  ctx.body = await {
    result: notes
  }
}

export async function getNote(ctx, next) {
  const note = await Notes.find({_id: ctx.request.body.id}).exec()
  ctx.body = await {
    result: note
  }
}

export async function addNote(ctx, next) {
  const note = new Notes({
    title: ctx.request.body.title,
    contents: ctx.request.body.contents
  })
  const saved_note = await note.save()
  ctx.body = await {
    success: true,
    note: saved_note
  }
}

export async function updateNote(ctx, next) {
  let updates = {}
  if(ctx.request.body.title)
    updates.title = ctx.request.body.title
  if(ctx.request.body.contents)
    updates.contents = ctx.request.body.contents
  await Notes.find({_id: ctx.request.body.id}).update(updates).exec()
  ctx.body = await {
    success: true
  }
}

export async function deleteNote(ctx, next) {
  console.log('aaaa')
  console.log(ctx.params.id)
  try {
    await Notes.findByIdAndRemove({_id: ctx.params.id}).exec()
    ctx.body = await {
      success: true
    }
  } catch(error) {
    ctx.body = await {
      success: false,
      error: error
    }
  }
}
router
.get('/notes', getNotes)
.post('/notes', addNote)
.get('/notes/:id', getNote)
.put('/notes/:id', updateNote)
.delete('/notes/:id', deleteNote)

export default router
