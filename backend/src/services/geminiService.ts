import { IMilestone } from '../models/Roadmap'

interface UserProfile {
    class: string
    stream: string
    targetExam: string[]
    interests: string[]
    challenges: string[]
    goals: string
}

// Intelligent fallback roadmap based on user profile
const generateFallbackRoadmap = (profile: UserProfile, focusArea: string): IMilestone[] => {
    const isEngineering = profile.stream === 'PCM' || profile.interests.includes('Computer Science & AI')
    const isMedical = profile.stream === 'PCB' || profile.interests.includes('Medical & Healthcare')

    const roadmaps: Record<string, IMilestone[]> = {
        career: isEngineering
            ? [
                {
                    title: 'Foundation & Self-Assessment',
                    duration: 'Weeks 1-2',
                    description: 'Assess your current skills and define your engineering career target.',
                    tasks: [
                        'Complete a skills inventory across Math, Physics, and CS',
                        'Research top 3 engineering specializations aligned to your interests',
                        'Set up a GitHub profile and push your first project',
                        'Join an online community (Discord/Reddit) in your target field',
                    ],
                    completed: false,
                    category: 'Foundation & Assessment',
                },
                {
                    title: 'Core Technical Skills',
                    duration: 'Weeks 3-10',
                    description: 'Build hands-on programming and problem-solving fundamentals.',
                    tasks: [
                        'Complete a Python or C++ fundamentals course (Coursera/NPTEL)',
                        'Solve 50 LeetCode easy problems',
                        'Build one mini-project (Calculator / Weather App / Portfolio Site)',
                        'Learn Git version control basics',
                    ],
                    completed: false,
                    category: 'Skill Development',
                },
                {
                    title: 'Entrance Exam Preparation',
                    duration: 'Months 3-8',
                    description: 'Structured preparation for JEE / BITSAT / SAT depending on your target.',
                    tasks: [
                        'Complete NCERT Physics and Math textbooks thoroughly',
                        'Attempt 2 full mock tests per week',
                        'Join a coaching institute or use platforms like Allen/Unacademy',
                        'Track weak topics and revise them every week',
                    ],
                    completed: false,
                    category: 'Exam Preparation',
                },
                {
                    title: 'College Readiness & Applications',
                    duration: 'Months 9-12',
                    description: 'Finalize college choices and strengthen your application profile.',
                    tasks: [
                        'Research and shortlist 10 colleges with cutoffs',
                        'Build a standout portfolio with 2-3 projects',
                        'Prepare Statement of Purpose / Letters of Recommendation if studying abroad',
                        'Register for target entrance exams',
                    ],
                    completed: false,
                    category: 'Application Cycle',
                },
            ]
            : isMedical
                ? [
                    {
                        title: 'Biology & Chemistry Mastery',
                        duration: 'Weeks 1-4',
                        description: 'Strengthen your core science fundamentals for NEET.',
                        tasks: [
                            'Complete NCERT Biology Chapters 1-15',
                            'Revise all organic reactions in Chemistry',
                            'Make detailed revision notes for each chapter',
                            'Attempt NEET chapter-wise mock tests',
                        ],
                        completed: false,
                        category: 'Dual Stream Strategy',
                    },
                    {
                        title: 'NEET Preparation Deep Dive',
                        duration: 'Months 2-8',
                        description: 'Full NEET preparation strategy with mock tests and revision.',
                        tasks: [
                            'Complete full NCERT syllabus for Physics, Chemistry, Biology',
                            'Attempt 1 full NEET mock test every weekend',
                            'Join Allen / Aakash for structured coaching',
                            'Analyze mock test performance and improve weak areas',
                        ],
                        completed: false,
                        category: 'Profile Enrichment',
                    },
                    {
                        title: 'College Research & Application',
                        duration: 'Months 9-12',
                        description: 'Prepare for AIIMS and top medical college admissions.',
                        tasks: [
                            'Research AIIMS, JIPMER, state medical college cutoffs',
                            'Complete NEET registration process',
                            'Prepare for AIIMS-specific sections (GK, Reasoning)',
                            'Have backup options including BAMS, BDS programs',
                        ],
                        completed: false,
                        category: 'Application Cycle',
                    },
                ]
                : [
                    {
                        title: 'Career Exploration',
                        duration: 'Weeks 1-3',
                        description: 'Explore career options that align with your interests.',
                        tasks: [
                            'Take the Mentora career aptitude quiz',
                            'Research top 5 career paths in your interest area',
                            'Connect with professionals on LinkedIn in your target field',
                            'Shadow or interview a professional in your field of interest',
                        ],
                        completed: false,
                        category: 'Career Exploration',
                    },
                    {
                        title: 'Skill Building',
                        duration: 'Months 2-5',
                        description: 'Develop essential skills for your chosen career.',
                        tasks: [
                            'Enroll in 2 relevant online courses (Coursera / edX / NPTEL)',
                            'Build a portfolio with 2 beginner projects',
                            'Attend at least 1 webinar or conference in your field',
                            'Join student clubs or communities related to your interest',
                        ],
                        completed: false,
                        category: 'Skill Development',
                    },
                    {
                        title: 'Academic & Exam Strategy',
                        duration: 'Months 6-12',
                        description: 'Align your academics with your career goals.',
                        tasks: [
                            'Map required college entrance exams to your goals',
                            'Begin entrance exam preparation with a study schedule',
                            'Research and shortlist 8 colleges with admission criteria',
                            'Start working on extra-curriculars and letters of recommendation',
                        ],
                        completed: false,
                        category: 'Application Cycle',
                    },
                ],
        exams: [
            {
                title: 'Exam Strategy & Planning',
                duration: 'Weeks 1-2',
                description: 'Define your exam targets and create a study plan.',
                tasks: [
                    `Identify target exams: ${profile.targetExam.slice(0, 2).join(', ') || 'JEE / NEET'}`,
                    'Analyze the syllabus and mark high-weight chapters',
                    'Create a 6-month study timetable with daily goals',
                    'Gather all study materials: NCERT, reference books, online resources',
                ],
                completed: false,
                category: 'Exam Strategy',
            },
            {
                title: 'Concept Mastery',
                duration: 'Months 1-4',
                description: 'Complete the syllabus with deep conceptual understanding.',
                tasks: [
                    'Complete NCERT textbooks for all subjects',
                    'Solve 200+ chapter-wise practice problems',
                    'Watch video lectures for difficult concepts (Khan Academy / Vedantu)',
                    'Create formula sheets and revision notes for each chapter',
                ],
                completed: false,
                category: 'Concept Mastery',
            },
            {
                title: 'Mock Tests & Revision',
                duration: 'Months 5-6',
                description: 'Intensive mock testing and targeted revision.',
                tasks: [
                    'Attempt 2-3 full mock tests per week',
                    'Analyze every mock test performance in detail',
                    'Revise all weak chapters using notes and formula sheets',
                    'Improve speed and accuracy through timed practice',
                ],
                completed: false,
                category: 'Mock Tests & Revision',
            },
        ],
        skills: [
            {
                title: 'Skill Identification',
                duration: 'Weeks 1-2',
                description: 'Identify the skills most relevant to your career goals.',
                tasks: [
                    `Research key skills for ${profile.interests[0] || 'your interest area'}`,
                    'Assess your current skill level honestly',
                    'Create a prioritized "skills to learn" list',
                    'Find the best free learning resources for each skill',
                ],
                completed: false,
                category: 'Skill Identification',
            },
            {
                title: 'Hands-on Learning',
                duration: 'Months 2-5',
                description: 'Learn by building — complete courses and real projects.',
                tasks: [
                    'Complete 2 structured online courses on core skills',
                    'Build 1 beginner project applying learned skills',
                    'Contribute to 1 open source or collaborative project',
                    'Practice daily using platforms like LeetCode / Kaggle / HackerRank',
                ],
                completed: false,
                category: 'Hands-on Learning',
            },
            {
                title: 'Portfolio & Showcase',
                duration: 'Months 6-8',
                description: 'Package your skills into a compelling portfolio.',
                tasks: [
                    'Build 2-3 showcase projects demonstrating real skills',
                    'Create a professional portfolio website or GitHub profile',
                    'Write 1 blog post explaining what you built and learned',
                    'Get feedback from a mentor or professional in the field',
                ],
                completed: false,
                category: 'Portfolio & Showcase',
            },
        ],
        college: [
            {
                title: 'Research & Shortlisting',
                duration: 'Weeks 1-4',
                description: 'Research colleges that match your academic profile and goals.',
                tasks: [
                    'Create a list of 15 target colleges across reach, match, and safety',
                    'Research admission requirements, cutoffs, and deadlines',
                    'Visit college websites and attend virtual open days',
                    'Connect with current students on Reddit / Quora / LinkedIn',
                ],
                completed: false,
                category: 'Dual Stream Strategy',
            },
            {
                title: 'Application Building',
                duration: 'Months 2-6',
                description: 'Build a strong application profile through academics and activities.',
                tasks: [
                    'Maintain a strong GPA in Class 11-12',
                    'Participate in 2-3 relevant extracurricular activities',
                    'Begin writing your Statement of Purpose / Personal Statement',
                    'Request teacher recommendations from 2 subject teachers',
                ],
                completed: false,
                category: 'Profile Enrichment',
            },
            {
                title: 'Application Submission',
                duration: 'Months 7-10',
                description: 'Finalize and submit all college applications.',
                tasks: [
                    'Complete all college application forms',
                    'Submit entrance exam scores (JEE / SAT / NEET as applicable)',
                    'Send recommendation letters to colleges',
                    'Apply for scholarships through college portals and external organizations',
                ],
                completed: false,
                category: 'Application Cycle',
            },
        ],
    }

    return roadmaps[focusArea] || roadmaps['career']
}

// Real Gemini API call
const callGeminiAPI = async (profile: UserProfile, focusArea: string): Promise<IMilestone[]> => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const prompt = `You are a career counselor for Indian high school students. Generate a personalized career roadmap.

Student Profile:
- Class: ${profile.class}
- Stream: ${profile.stream}
- Target Exams: ${profile.targetExam.join(', ') || 'Not specified'}
- Interests: ${profile.interests.join(', ') || 'Not specified'}
- Goals: ${profile.goals}
- Focus Area: ${focusArea}

Generate a JSON array of 3-4 milestone objects. Each milestone must have:
- title: string (concise milestone name)
- duration: string (e.g., "Weeks 1-3", "Months 2-5")
- description: string (1-2 sentences about this phase)
- tasks: string[] (exactly 4 specific, actionable tasks)
- completed: false
- category: string (a short grouping label for progress tracking, e.g., "Dual Stream Strategy", "Profile Enrichment", "Application Cycle")

Return ONLY a valid JSON array with no markdown or explanation.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Parse JSON, removing markdown code fences if present
    const jsonText = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '')
    const milestones: IMilestone[] = JSON.parse(jsonText)

    return milestones.map((m) => ({ ...m, completed: false }))
}

export const generateRoadmap = async (
    profile: UserProfile,
    focusArea: string
): Promise<IMilestone[]> => {
    const apiKey = process.env.GEMINI_API_KEY

    if (apiKey && apiKey.length > 10) {
        try {
            console.log('🤖 Calling Gemini API for roadmap generation...')
            return await callGeminiAPI(profile, focusArea)
        } catch (error) {
            console.error('⚠️ Gemini API failed, using intelligent fallback:', error)
        }
    } else {
        console.log('📋 No Gemini API key found — using intelligent fallback roadmap')
    }

    return generateFallbackRoadmap(profile, focusArea)
}
