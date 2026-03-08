import { Router } from 'express'
import { getCoursesForMilestoneHandler, getResourcesForTaskHandler } from '../controllers/course.controller'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
// GET /api/courses/milestone/:index
router.get('/milestone/:index', getCoursesForMilestoneHandler)
// GET /api/courses/task/:milestoneIndex/:taskIndex
router.get('/task/:milestoneIndex/:taskIndex', getResourcesForTaskHandler)

export default router
