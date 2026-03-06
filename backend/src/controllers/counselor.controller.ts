import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Profile } from '../models/Profile'
import { QuizResult } from '../models/QuizResult'

interface ChatMessage {
    role: 'user' | 'model'
    content: string
}

const buildSystemPrompt = (profileSummary: string): string =>
    `You are Mentora AI, a warm, expert career counselor for Indian students (Class 9–12 and beyond). You have deep knowledge of:
- Indian education system (CBSE, ICSE, state boards)
- Competitive exams: JEE, NEET, CLAT, CAT, CUET, NDA, SAT
- Career paths in STEM, Medicine, Law, Commerce, Arts, Design, Management
- Top Indian colleges: IITs, NITs, IIITs, AIIMS, NLUs, IIMs
- Study abroad options, scholarships, and visa processes
- Skill development, certifications, and internships
- Mental health, study strategies, and motivation
${profileSummary ? `\nStudent Context: ${profileSummary}` : ''}

Guidelines:
- Be warm, encouraging, and concise.
- Give specific, actionable advice with real institution names and examples.
- Use bullet points for clarity when listing options.
- Always acknowledge the student's situation before advising.
- If a question is outside career/education, politely redirect.
- Keep responses under 300 words unless deep explanation is needed.`

const buildProfileSummary = async (userId: string): Promise<string> => {
    try {
        const [profile, quiz] = await Promise.all([
            Profile.findOne({ userId }),
            QuizResult.findOne({ userId }).sort({ createdAt: -1 }),
        ])
        const parts: string[] = []
        if (profile) {
            if (profile.class) parts.push(`Class: ${profile.class}`)
            if (profile.stream) parts.push(`Stream: ${profile.stream}`)
            if (profile.interests?.length) parts.push(`Interests: ${profile.interests.join(', ')}`)
            if (profile.targetExam?.length) parts.push(`Target Exams: ${profile.targetExam.join(', ')}`)
            if (profile.goals) parts.push(`Goals: ${profile.goals}`)
        }
        if (quiz?.topCategory) parts.push(`Aptitude: strongest in ${quiz.topCategory}`)
        return parts.join(' | ')
    } catch {
        return ''
    }
}

const FALLBACK_RESPONSES: Record<string, string> = {
    jee: 'For JEE preparation, focus on NCERT fundamentals first. Recommended: HC Verma for Physics, RD Sharma + Cengage for Maths, NCERT + MS Chouhan for Chemistry. Allocate 6–8 hours daily with weekly mock tests.',
    neet: 'For NEET, Biology carries 360 marks — master NCERT Biology line by line. Use DC Pandey for Physics and Narendra Awasthi for Chemistry. Aim for 720+ with 5 focused hours daily.',
    career: 'Career choices should align with your interests, strengths, and market demand. Have you taken our Aptitude Quiz? It analyzes your profile and suggests the best-fit careers. Try it from the Dashboard!',
    cs: 'Computer Science is one of the most in-demand fields. Key paths: Software Engineering at IITs/NITs, Data Science, AI/ML Research, Cybersecurity, or Product Management. Start coding in Python and build projects on GitHub.',
    default: "I'm your AI career counselor! Ask me anything about college admissions, career paths, exam preparation, or study strategies. I'm here to guide you every step of the way! 🎯",
}

// Models to try in order — confirmed working model first
const MODEL_CHAIN = ['gemini-flash-latest', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash']

export const chatWithAI = async (req: AuthRequest, res: Response): Promise<void> => {
    const { message, history = [] } = req.body as { message: string; history: ChatMessage[] }

    if (!message?.trim()) {
        res.status(400).json({ success: false, message: 'Message is required.' })
        return
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.length < 10) {
        const key = Object.keys(FALLBACK_RESPONSES).find((k) => message.toLowerCase().includes(k)) ?? 'default'
        res.json({ success: true, reply: FALLBACK_RESPONSES[key], source: 'fallback' })
        return
    }

    let profileSummary = ''
    try { profileSummary = await buildProfileSummary(req.user!.id) } catch { /* non-critical */ }

    const genAI = new GoogleGenerativeAI(apiKey)

    const systemHistory = [
        {
            role: 'user' as const,
            parts: [{ text: `${buildSystemPrompt(profileSummary)}\n\nPlease confirm you understand your role.` }],
        },
        {
            role: 'model' as const,
            parts: [{ text: "Understood! I'm Mentora AI, your dedicated career counselor specializing in Indian education. How can I help you today?" }],
        },
        ...history.slice(-8).map((msg) => ({
            role: msg.role as 'user' | 'model',
            parts: [{ text: msg.content }],
        })),
    ]

    // Try each model in chain until one succeeds
    for (const modelName of MODEL_CHAIN) {
        try {
            console.log(`[Counselor] Trying model: ${modelName}`)
            const model = genAI.getGenerativeModel({ model: modelName })
            const chat = model.startChat({ history: systemHistory })
            const result = await chat.sendMessage(message.trim())
            const reply = result.response.text()
            if (!reply) throw new Error('Empty response')
            console.log(`[Counselor] Success with model: ${modelName}`)
            res.json({ success: true, reply, source: modelName })
            return
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err)
            console.warn(`[Counselor] Model ${modelName} failed: ${errMsg.substring(0, 120)}`)
            // Continue to next model
        }
    }

    // All models failed — return helpful fallback (not a 500)
    const key = Object.keys(FALLBACK_RESPONSES).find((k) => message.toLowerCase().includes(k)) ?? 'default'
    console.error('[Counselor] All Gemini models failed — serving curated fallback')
    res.json({
        success: true,
        reply: `${FALLBACK_RESPONSES[key]}\n\n*(AI is momentarily unavailable — this is a curated response)*`,
        source: 'fallback',
    })
}

export const getAICareerRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
    const apiKey = process.env.GEMINI_API_KEY
    const fallbackCareers = ["Computer Science Engineering", "Data Science", "Medicine (MBBS)", "Business Administration"]

    if (!apiKey || apiKey.length < 10) {
        res.json({ success: true, careers: fallbackCareers, source: 'fallback' })
        return
    }

    try {
        const profileSummary = await buildProfileSummary(req.user!.id)
        const genAI = new GoogleGenerativeAI(apiKey)

        const prompt = `Based on this student profile summary: "${profileSummary || 'A high school student exploring careers'}", recommend exactly 4 specific, high-growth career paths in India.
CRITICAL INSTRUCTION: Your response must be ONLY a raw, valid JSON array of 4 strings representing the career titles. Do not include any markdown formatting like \`\`\`json or \`\`\`. Do not include any explanation.
Example: ["Career 1", "Career 2", "Career 3", "Career 4"]`

        for (const modelName of MODEL_CHAIN) {
            try {
                console.log(`[Recommendations] Trying model: ${modelName}`)
                const model = genAI.getGenerativeModel({ model: modelName })
                const result = await model.generateContent(prompt)
                let reply = result.response.text().trim()

                // Clean up any markdown blocks if the AI disobeyed instructions
                if (reply.startsWith('```json')) reply = reply.substring(7)
                if (reply.startsWith('```')) reply = reply.substring(3)
                if (reply.endsWith('```')) reply = reply.substring(0, reply.length - 3)
                reply = reply.trim()

                const careers = JSON.parse(reply)

                if (Array.isArray(careers) && careers.length > 0) {
                    res.json({ success: true, careers: careers.slice(0, 4), source: modelName })
                    return
                }
            } catch (err) {
                console.warn(`[Recommendations] Model ${modelName} failed or returned invalid JSON.`)
            }
        }

        throw new Error("All models failed to return valid JSON arrays")

    } catch (error) {
        console.error('[Recommendations] Error generating recommendations:', error)
        res.json({ success: true, careers: fallbackCareers, source: 'fallback' })
    }
}

