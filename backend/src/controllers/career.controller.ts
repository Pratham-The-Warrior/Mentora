import { Request, Response } from 'express'
import { Career } from '../models/Career'

export const getCareers = async (req: Request, res: Response): Promise<void> => {
    const { category, search } = req.query

    const query: Record<string, unknown> = {}
    if (category && typeof category === 'string') {
        query.categories = { $in: [category] }
    }
    if (search && typeof search === 'string') {
        query.title = { $regex: search, $options: 'i' }
    }

    const careers = await Career.find(query).sort({ title: 1 })
    res.json({ success: true, count: careers.length, careers })
}

export const getCareerById = async (req: Request, res: Response): Promise<void> => {
    const career = await Career.findById(req.params.id)
    if (!career) {
        res.status(404).json({ success: false, message: 'Career not found.' })
        return
    }
    res.json({ success: true, career })
}
