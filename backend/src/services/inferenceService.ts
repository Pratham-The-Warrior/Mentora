import { GoogleGenerativeAI } from '@google/generative-ai'

interface UserProfile {
    class: string
    stream: string
    interests: string[]
    goals: string
}

interface AptitudeScores {
    logical: number
    analytical: number
    quantitative: number
    verbal: number
}

interface InferenceResult {
    careerTitle: string
    matchScore: number
    aiReasoning: string
}

export const generateCareerInferences = async (
    profile: UserProfile,
    scores: AptitudeScores,
    topRecommendations: any[]
): Promise<InferenceResult[]> => {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.length < 10) {
        console.log('📋 No Gemini API key found — using fallback inferences')
        return topRecommendations.map(r => ({
            careerTitle: r.career.title,
            matchScore: r.matchScore,
            aiReasoning: `Your ${Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]} skills are a strong match for ${r.career.title}.`
        }))
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

        const prompt = `You are an expert career counselor. Analyze a student's aptitude test results and profile to provide deep reasoning for career recommendations.

Student Profile:
- Class: ${profile.class}
- Stream: ${profile.stream}
- Interests: ${profile.interests.join(', ')}
- Goals: ${profile.goals}

Aptitude Scores (1-5 scale):
- Logical Reasoning: ${scores.logical}/5
- Analytical Thinking: ${scores.analytical}/5
- Quantitative Ability: ${scores.quantitative}/5
- Verbal Ability: ${scores.verbal}/5

Initial Recommendations:
${topRecommendations.map(r => `- ${r.career.title} (${r.matchScore}% base match)`).join('\n')}

Task:
For the top 3 careers, provide a concise (1-2 sentences) "Verified Fit" explanation. This explanation should connect their specific aptitude strengths (e.g., high logical score) and their stated interests to the chosen career.

Return ONLY a JSON array of objects with these keys:
- careerTitle: string
- matchScore: number (original match score)
- aiReasoning: string (your expert explanation)

Example:
[{"careerTitle": "Data Scientist", "matchScore": 95, "aiReasoning": "Your exceptional 5/5 logical score perfectly complements your interest in AI, making you a natural fit for complex data modeling."}]`

        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()

        // Clean markdown if present
        const jsonText = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '')
        const inferences: InferenceResult[] = JSON.parse(jsonText)

        return inferences
    } catch (error) {
        console.error('⚠️ Gemini Inference failed:', error)
        return topRecommendations.map(r => ({
            careerTitle: r.career.title,
            matchScore: r.matchScore,
            aiReasoning: `Strong alignment with your ${profile.stream} stream and aptitude profile.`
        }))
    }
}
