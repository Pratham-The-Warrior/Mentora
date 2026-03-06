import { Response } from 'express'
import { Roadmap } from '../models/Roadmap'
import { Profile } from '../models/Profile'
import { AuthRequest } from '../middleware/auth'
import { generateRoadmap } from '../services/geminiService'

export const generateRoadmapHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    const { focusArea } = req.body

    if (!focusArea) {
        res.status(400).json({ success: false, message: 'focusArea is required.' })
        return
    }

    const profile = await Profile.findOne({ userId: req.user?.id })
    if (!profile) {
        res.status(404).json({ success: false, message: 'Please complete onboarding before generating a roadmap.' })
        return
    }

    // Create a GENERATING placeholder first
    const roadmap = await Roadmap.create({
        userId: req.user?.id,
        focusArea,
        status: 'GENERATING',
        milestones: [],
    })

    try {
        const milestones = await generateRoadmap(
            {
                class: profile.class,
                stream: profile.stream,
                targetExam: profile.targetExam,
                interests: profile.interests,
                challenges: profile.challenges,
                goals: profile.goals,
            },
            focusArea
        )

        roadmap.milestones = milestones
        roadmap.status = 'COMPLETED'
        await roadmap.save()

        res.status(201).json({ success: true, roadmap })
    } catch (error) {
        roadmap.status = 'FAILED'
        await roadmap.save()
        console.error('Roadmap generation error:', error)
        res.status(500).json({ success: false, message: 'Failed to generate roadmap. Please try again.' })
    }
}

export const getRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
    const roadmap = await Roadmap.findOne({
        userId: req.user?.id,
        status: 'COMPLETED',
    }).sort({ createdAt: -1 })

    if (!roadmap) {
        res.status(404).json({ success: false, message: 'No roadmap found. Generate one from your dashboard.' })
        return
    }

    res.json({ success: true, roadmap })
}

export const toggleMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
    const { index } = req.params

    const roadmap = await Roadmap.findOne({ userId: req.user?.id, status: 'COMPLETED' }).sort({ createdAt: -1 })
    if (!roadmap) {
        res.status(404).json({ success: false, message: 'No roadmap found.' })
        return
    }

    const milestoneIndex = parseInt(index, 10)
    if (milestoneIndex < 0 || milestoneIndex >= roadmap.milestones.length) {
        res.status(400).json({ success: false, message: 'Invalid milestone index.' })
        return
    }

    roadmap.milestones[milestoneIndex].completed = !roadmap.milestones[milestoneIndex].completed
    if (roadmap.milestones[milestoneIndex].completed) {
        roadmap.milestones[milestoneIndex].completedAt = new Date()
    } else {
        roadmap.milestones[milestoneIndex].completedAt = undefined
    }

    await roadmap.save()

    res.json({ success: true, roadmap })
}

export const getAllRoadmaps = async (req: AuthRequest, res: Response): Promise<void> => {
    const roadmaps = await Roadmap.find({ userId: req.user?.id }).sort({ createdAt: -1 })
    res.json({ success: true, roadmaps })
}
