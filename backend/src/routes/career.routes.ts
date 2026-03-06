import { Router } from 'express'
import { getCareers, getCareerById } from '../controllers/career.controller'

const router = Router()

// Public routes — no auth required for browsing careers
router.get('/', getCareers)
router.get('/:id', getCareerById)

export default router
