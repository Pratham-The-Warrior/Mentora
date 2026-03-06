import { Router } from 'express'
import { getCoursesForMilestoneHandler } from '../controllers/course.controller'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
// GET /api/courses/milestone/:index
router.get('/milestone/:index', getCoursesForMilestoneHandler)

export default router
