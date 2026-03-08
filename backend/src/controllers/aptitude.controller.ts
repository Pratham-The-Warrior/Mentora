import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { AptitudeQuestion } from '../models/AptitudeQuestion'
import { QuizResult } from '../models/QuizResult'
import { Career } from '../models/Career'
import { Profile } from '../models/Profile'
import { generateCareerInferences } from '../services/inferenceService'

// Temporary in-memory session store (In a real app, use Redis or DB)
const testSessions: Record<string, {
    currentDifficulties: Record<string, number>,
    answers: Array<{ questionId: string, isCorrect: boolean, category: string, difficulty: number }>,
    categories: string[],
    currentCategoryIndex: number,
    questionList: string[]
}> = {}

const CATEGORIES = ['logical', 'analytical', 'quantitative', 'verbal']

export const startAptitudeTest = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    // Build a fixed set of questions for the session (Adaptive selection can happen here once)
    const questions: any[] = []

    // Select 4 questions from each category for a total of 16 (or adjust as needed)
    // We'll aim for 15 total to match frontend: 4, 4, 4, 3
    for (let i = 0; i < CATEGORIES.length; i++) {
        const cat = CATEGORIES[i]
        const count = i === CATEGORIES.length - 1 ? 3 : 4

        // Pick a mix of difficulties (1-5)
        const catQuestions = await AptitudeQuestion.aggregate([
            { $match: { category: cat } },
            { $sample: { size: count } }
        ])
        questions.push(...catQuestions)
    }

    testSessions[userId.toString()] = {
        currentDifficulties: { logical: 2, analytical: 2, quantitative: 2, verbal: 2 },
        answers: [],
        categories: CATEGORIES,
        currentCategoryIndex: 0,
        // Store pre-selected questions
        questionList: questions.map(q => q._id.toString())
    }

    res.json({ success: true, message: 'Test started', questions })
}

export const getNextQuestion = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const session = testSessions[userId.toString()]
    if (!session) {
        console.log(`❌ No session found for user: ${userId}`)
        return res.status(400).json({ message: 'No active session' })
    }

    const category = session.categories[session.currentCategoryIndex]
    const difficulty = session.currentDifficulties[category]
    console.log(`🔍 Fetching question for user ${userId}: category=${category}, difficulty=${difficulty}`)

    // Find questions for this category and difficulty that haven't been answered
    const answeredIds = session.answers.map(a => a.questionId)
    let question = await AptitudeQuestion.findOne({
        category,
        difficulty,
        _id: { $nin: answeredIds }
    })

    // Fallback if no question at this difficulty
    if (!question) {
        console.log(`⚠️ No question found for difficulty ${difficulty}, trying fallback for category ${category}`)
        question = await AptitudeQuestion.findOne({
            category,
            _id: { $nin: answeredIds }
        })
    }

    if (!question) {
        console.log(`🏁 No more questions in category ${category}, moving to next...`)
        // Move to next category if possible
        if (session.currentCategoryIndex < session.categories.length - 1) {
            session.currentCategoryIndex++
            return getNextQuestion(req, res)
        } else {
            console.log(`🎉 Test finished for user ${userId}`)
            return res.json({ success: true, finished: true })
        }
    }

    console.log(`✅ Found question: ${question._id}`)
    res.json({ success: true, question })
}

export const submitAnswer = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id
    const { questionId, answerIndex } = req.body as { questionId: string, answerIndex: number }
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const session = testSessions[userId.toString()]
    if (!session) return res.status(400).json({ message: 'No active session' })

    // Validation: Check if already answered
    if (session.answers.find(a => a.questionId === questionId)) {
        return res.status(400).json({ message: 'Question already answered' })
    }

    const question = await AptitudeQuestion.findById(questionId)
    if (!question) return res.status(404).json({ message: 'Question not found' })

    const isCorrect = question.correctOption === answerIndex
    const category = question.category

    // Update session
    session.answers.push({
        questionId: question._id.toString(),
        isCorrect,
        category,
        difficulty: question.difficulty
    })

    // Adaptive Logic: Adjust difficulty
    if (isCorrect) {
        session.currentDifficulties[category] = Math.min(5, session.currentDifficulties[category] + 1)
    } else {
        session.currentDifficulties[category] = Math.max(1, session.currentDifficulties[category] - 1)
    }

    // Check if we should switch category (3 questions per category)
    const categoryAnswers = session.answers.filter(a => a.category === category)
    if (categoryAnswers.length >= 3) {
        if (session.currentCategoryIndex < session.categories.length - 1) {
            session.currentCategoryIndex++
        }
    }

    res.json({ success: true, isCorrect, explanation: question.explanation })
}

export const getLatestResult = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    try {
        const latestResult = await QuizResult.findOne({ userId }).sort({ createdAt: -1 })
        if (!latestResult) {
            return res.status(404).json({ success: false, message: 'No results found' })
        }
        res.json({ success: true, ...latestResult.toObject() })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch results' })
    }
}

export const submitResults = async (req: AuthRequest, res: Response): Promise<any> => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const session = testSessions[userId.toString()]
    if (!session) return res.status(400).json({ message: 'No active session' })

    // Standard requirement: at least 5 questions for a meaningful profile (matching frontend)
    if (session.answers.length < 5) {
        return res.status(400).json({ message: 'Test not sufficiently completed to generate results. Minimum 5 questions required.' })
    }

    try {
        const scores: Record<string, number> = { logical: 0, analytical: 0, quantitative: 0, verbal: 0 }

        // Weighted Scoring Algorithm:
        // (Sum of difficulty for correct answers / Sum of difficulty for all attempted in category) * 5
        CATEGORIES.forEach(cat => {
            const catAnswers = session.answers.filter(a => a.category === cat)
            if (catAnswers.length > 0) {
                const totalDifficulty = catAnswers.reduce((sum, a) => sum + a.difficulty, 0)
                const correctDifficulty = catAnswers.filter(a => a.isCorrect).reduce((sum, a) => sum + a.difficulty, 0)

                // Scale to 0-5
                scores[cat] = Math.round((correctDifficulty / totalDifficulty) * 5 * 10) / 10
            } else {
                scores[cat] = 0
            }
        })

        // Matching Engine (Euclidean Distance)
        const careers = await Career.find()
        const rawRecommendations = careers.map(career => {
            const reqs = career.aptitudeRequirements
            let distance = 0
            distance += Math.pow(scores.logical - reqs.logical, 2)
            distance += Math.pow(scores.analytical - reqs.analytical, 2)
            distance += Math.pow(scores.quantitative - reqs.quantitative, 2)
            distance += Math.pow(scores.verbal - reqs.verbal, 2)

            const matchScore = Math.max(0, 100 - Math.sqrt(distance) * 10)
            return {
                career,
                matchScore: Math.round(matchScore)
            }
        }).sort((a, b) => b.matchScore - a.matchScore)

        // Fetch user profile for AI inference
        const profile = await Profile.findOne({ userId })

        // AI Inference
        const aiRecommendations = await generateCareerInferences(
            profile ? {
                class: profile.class,
                stream: profile.stream,
                interests: profile.interests,
                goals: profile.goals
            } : {
                class: '12th',
                stream: 'PCM',
                interests: ['Science'],
                goals: 'Engineering'
            },
            scores as any,
            rawRecommendations.slice(0, 3)
        )

        // Save to DB
        const result = new QuizResult({
            userId,
            answers: session.answers,
            scores,
            recommendations: aiRecommendations,
            topCategory: aiRecommendations[0]?.careerTitle || 'General'
        })
        await result.save()

        // Cleanup session
        delete testSessions[userId.toString()]

        res.json({ success: true, scores, recommendations: aiRecommendations })
    } catch (error) {
        console.error('Failed to submit results:', error)
        res.status(500).json({ message: 'Failed to process test results' })
    }
}
