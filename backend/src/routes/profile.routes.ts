import { Router } from 'express'
import { upsertProfile, getProfile } from '../controllers/profile.controller'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.post('/', upsertProfile)
router.get('/', getProfile)

export default router
