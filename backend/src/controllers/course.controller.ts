import { Response } from 'express'
import { Roadmap } from '../models/Roadmap'
import { AuthRequest } from '../middleware/auth'
import { getCoursesForMilestone, getResourcesForTaskText } from '../services/courseService'

export const getCoursesForMilestoneHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    const milestoneIndex = parseInt(req.params.index, 10)

    const roadmap = await Roadmap.findOne({ userId: req.user?.id, status: 'COMPLETED' }).sort({ createdAt: -1 })

    if (!roadmap) {
        res.status(404).json({ success: false, message: 'No roadmap found.' })
        return
    }

    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
        res.status(400).json({ success: false, message: 'Invalid milestone index.' })
        return
    }

    const milestone = roadmap.milestones[milestoneIndex]
    const courses = await getCoursesForMilestone(milestone)

    res.json({ success: true, milestone: milestone.title, courses })
}

export const getResourcesForTaskHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    const milestoneIndex = parseInt(req.params.milestoneIndex, 10)
    const taskIndex = parseInt(req.params.taskIndex, 10)

    const roadmap = await Roadmap.findOne({ userId: req.user?.id, status: 'COMPLETED' }).sort({ createdAt: -1 })

    if (!roadmap) {
        res.status(404).json({ success: false, message: 'No roadmap found.' })
        return
    }

    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
        res.status(400).json({ success: false, message: 'Invalid milestone index.' })
        return
    }

    const milestone = roadmap.milestones[milestoneIndex]

    if (taskIndex < 0 || taskIndex >= milestone.tasks.length) {
        res.status(400).json({ success: false, message: 'Invalid task index.' })
        return
    }

    const taskText = milestone.tasks[taskIndex]
    const resources = await getResourcesForTaskText(taskText, milestone)

    res.json({ success: true, task: taskText, resources })
}
