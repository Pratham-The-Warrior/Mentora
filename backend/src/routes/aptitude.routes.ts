import { Router } from 'express'
import { startAptitudeTest, getNextQuestion, submitAnswer, getLatestResult, submitResults } from '../controllers/aptitude.controller'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)

router.post('/start', startAptitudeTest as any)
router.get('/next-question', getNextQuestion as any)
router.post('/submit-answer', submitAnswer as any)
router.get('/latest', getLatestResult as any)
router.post('/results', submitResults as any)

export default router
