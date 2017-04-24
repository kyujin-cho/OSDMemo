import Notes from '../../DB/Note'

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
  await note.save()
  ctx.body = await {
    success: true
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
  await Notes.find({_id: ctx.request.body.id}).remove().exec()
}
