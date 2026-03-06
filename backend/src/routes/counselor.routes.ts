import { Router } from 'express'
import { chatWithAI, getAICareerRecommendations } from '../controllers/counselor.controller'
import { protect } from '../middleware/auth'

const router = Router()
router.use(protect)

// POST /api/counselor/chat
router.post('/chat', chatWithAI)

// GET /api/counselor/recommendations
router.get('/recommendations', getAICareerRecommendations)

export default router
