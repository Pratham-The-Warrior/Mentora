import { Response } from 'express'
import { Profile } from '../models/Profile'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'

const ProfileSchema = z.object({
    class: z.string().optional(),
    stream: z.string().optional(),
    targetExam: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    challenges: z.array(z.string()).optional(),
    goals: z.string().optional(),
})

export const upsertProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const parsed = ProfileSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ success: false, message: parsed.error.errors[0].message })
        return
    }

    const profile = await Profile.findOneAndUpdate(
        { userId: req.user?.id },
        { userId: req.user?.id, ...parsed.data },
        { upsert: true, new: true, runValidators: true }
    )

    res.json({ success: true, profile })
}

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const profile = await Profile.findOne({ userId: req.user?.id })
    if (!profile) {
        res.status(404).json({ success: false, message: 'Profile not found. Please complete onboarding.' })
        return
    }
    res.json({ success: true, profile })
}
