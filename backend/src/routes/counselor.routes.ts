import { Router } from 'express'
import { chatWithAI } from '../controllers/counselor.controller'
import { protect } from '../middleware/auth'

const router = Router()
router.use(protect)

// POST /api/counselor/chat
router.post('/chat', chatWithAI)

export default router
