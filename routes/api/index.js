import Router from 'koa-router'
import levelup from 'levelup'
import thenLevelup from 'then-levelup'
import passwordHash from 'password-hash'
import controller_settings from './settings.controller'

const db = thenLevelup(levelup(process.env.NOTE_FILEPATH, {'valueEncoding': 'json'}))
const router = new Router({prefix: '/api'})

export async function getNotes(ctx, next) {
  console.log(db)
  let datas = {}
  const readDb = await new Promise((resolve, reject) => {
    db.createReadStream()
    .on('data', data => datas[data.key] = data.value)
    .on('error', reject)
    .on('end', resolve)
  })
  
  ctx.body = await {
    result: datas
  }
}

export async function getIsLocked(ctx, next) {
  const isLocked = await db.get('isLocked')
  ctx.body = await {
    result: isLocked === true
  }
}
export async function getNote(ctx, next) {
  const note = await db.get(ctx.params.id)
  ctx.body = await {
    result: note
  }
}

export async function addNote(ctx, next) {
  const d = new Date(ctx.request.body.date)
  console.log(d)
  const note = {
    title: ctx.request.body.title,
    contents: ctx.request.body.contents,
    latitude: ctx.request.body.latitude,
    longitude: ctx.request.body.longitude,
    time: d
  }
  const key = passwordHash.generate(note.title + note.contents + note.latitude + note.longitude)
  await db.put(key, note)
  ctx.body = await {
    success: true,
    key: key,
    note: note
  }
}

export async function updateNote(ctx, next) {
  const data = await db.get(ctx.params.id)
  data['title'] = ctx.request.body.title
  data['contents'] = ctx.request.body.contents
  await db.put(ctx.params.id, data)
  ctx.body = await {
    success: true,
    note: data
  }
}

export async function deleteNote(ctx, next) {
  await db.del(ctx.params.id)
  ctx.body = await {
    success: true
  }
}

export async function uploadBackground(ctx, next) {
  const image = ctx.request.body.image
}
router
.get('/notes', getNotes)
.post('/notes', addNote)
.get('/notes/:id', getNote)
.put('/notes/:id', updateNote)
.delete('/notes/:id', deleteNote)

export default router
