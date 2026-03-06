import { Router } from 'express'
import { submitQuiz, getQuizResult } from '../controllers/quiz.controller'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.post('/submit', submitQuiz)
router.get('/result', getQuizResult)

export default router
