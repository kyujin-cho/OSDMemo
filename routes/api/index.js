import Router from 'koa-router'
import controller_notes from './notes.controller'
import controller_settings from './settings.controller'

const router = new Router({prefix: '/api'})

router.get('/notes', controller_notes.getNotes)
router.post('/notes', controller_notes.addNote)
router.get('/notes/:id', controller_notes.getNote)
router.update('/notes/:id', controller_notes.updateNote)
router.delete('/notes/:id', controller_notes.deleteNote)

export default router
