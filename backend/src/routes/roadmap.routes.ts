import { Router } from 'express'
import {
    generateRoadmapHandler,
    getRoadmap,
    toggleMilestone,
    getAllRoadmaps,
} from '../controllers/roadmap.controller'
import { protect } from '../middleware/auth'

const router = Router()

router.use(protect)
router.post('/generate', generateRoadmapHandler)
router.get('/', getRoadmap)
router.get('/all', getAllRoadmaps)
router.patch('/milestone/:index', toggleMilestone)

export default router
