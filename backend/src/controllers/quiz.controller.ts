import { Response } from 'express'
import { QuizResult } from '../models/QuizResult'
import { AuthRequest } from '../middleware/auth'

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
    const { answers, scores, topCategory } = req.body

    if (!answers || !scores || !topCategory) {
        res.status(400).json({ success: false, message: 'answers, scores, and topCategory are required.' })
        return
    }

    const quizResult = await QuizResult.create({
        userId: req.user?.id,
        answers,
        scores,
        topCategory,
    })

    res.status(201).json({ success: true, quizResult })
}

export const getQuizResult = async (req: AuthRequest, res: Response): Promise<void> => {
    const quizResult = await QuizResult.findOne({ userId: req.user?.id }).sort({ createdAt: -1 })
    if (!quizResult) {
        res.status(404).json({ success: false, message: 'No quiz results found.' })
        return
    }
    res.json({ success: true, quizResult })
}
