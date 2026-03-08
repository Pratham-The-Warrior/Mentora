import { IMilestone } from '../models/Roadmap'

export interface CourseRecommendation {
    title: string
    platform: 'Coursera' | 'NPTEL' | 'YouTube' | 'freeCodeCamp' | 'Khan Academy' | 'Udemy' | 'edX'
    url: string
    effort: string
    isFree: boolean
    tags: string[]
}

// ─── Curated static course database keyed by topic keywords ───────────────
const COURSE_DATABASE: Record<string, CourseRecommendation[]> = {
    python: [
        { title: 'Python for Everybody', platform: 'Coursera', url: 'https://www.coursera.org/specializations/python', effort: '8 weeks', isFree: false, tags: ['beginner', 'programming'] },
        { title: 'Python Programming - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/106106182', effort: '8 weeks', isFree: true, tags: ['beginner', 'programming'] },
        { title: 'Python Full Course for Beginners', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', effort: '4.5 hours', isFree: true, tags: ['beginner', 'programming'] },
        { title: 'Learn Python - Full Course', platform: 'freeCodeCamp', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', effort: '4.5 hours', isFree: true, tags: ['beginner', 'programming'] },
    ],
    'machine learning': [
        { title: 'Machine Learning by Andrew Ng', platform: 'Coursera', url: 'https://www.coursera.org/learn/machine-learning', effort: '11 weeks', isFree: false, tags: ['ML', 'AI', 'intermediate'] },
        { title: 'Machine Learning - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/106106139', effort: '12 weeks', isFree: true, tags: ['ML', 'AI', 'intermediate'] },
        { title: 'Machine Learning Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=NWONeJKn6kc', effort: '10 hours', isFree: true, tags: ['ML', 'beginner'] },
    ],
    'data science': [
        { title: 'IBM Data Science Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-data-science', effort: '12 months', isFree: false, tags: ['data science', 'intermediate'] },
        { title: 'Data Science for Engineers - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/106106179', effort: '8 weeks', isFree: true, tags: ['data science', 'engineering'] },
        { title: 'Data Science Full Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=ua-CiDNNj30', effort: '6 hours', isFree: true, tags: ['data science', 'beginner'] },
    ],
    algorithms: [
        { title: 'Algorithms Specialization by Stanford', platform: 'Coursera', url: 'https://www.coursera.org/specializations/algorithms', effort: '4 months', isFree: false, tags: ['DSA', 'intermediate'] },
        { title: 'Design and Analysis of Algorithms - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/106101060', effort: '12 weeks', isFree: true, tags: ['DSA', 'intermediate'] },
        { title: 'Data Structures and Algorithms in Python', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=pkYVOmU3MgA', effort: '5 hours', isFree: true, tags: ['DSA', 'python'] },
    ],
    mathematics: [
        { title: 'Mathematics for Machine Learning', platform: 'Coursera', url: 'https://www.coursera.org/specializations/mathematics-machine-learning', effort: '3 months', isFree: false, tags: ['math', 'ML'] },
        { title: 'Mathematics for Machine Learning - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/111108065', effort: '12 weeks', isFree: true, tags: ['math', 'linear algebra'] },
        { title: 'Essence of Linear Algebra - 3Blue1Brown', platform: 'YouTube', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', effort: '4 hours', isFree: true, tags: ['math', 'linear algebra', 'visual'] },
        { title: 'Khan Academy Math', platform: 'Khan Academy', url: 'https://www.khanacademy.org/math', effort: 'Self-paced', isFree: true, tags: ['math', 'beginner'] },
    ],
    physics: [
        { title: 'Physics - Khan Academy', platform: 'Khan Academy', url: 'https://www.khanacademy.org/science/physics', effort: 'Self-paced', isFree: true, tags: ['physics', 'JEE'] },
        { title: 'Engineering Physics - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/115103109', effort: '8 weeks', isFree: true, tags: ['physics', 'engineering'] },
        { title: 'Physics Full Course for JEE', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=d9_NKPQ-pX0', effort: '20+ hours', isFree: true, tags: ['physics', 'JEE'] },
    ],
    chemistry: [
        { title: 'Chemistry - Khan Academy', platform: 'Khan Academy', url: 'https://www.khanacademy.org/science/chemistry', effort: 'Self-paced', isFree: true, tags: ['chemistry', 'NEET'] },
        { title: 'Organic Chemistry - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/104101015', effort: '12 weeks', isFree: true, tags: ['chemistry', 'organic'] },
    ],
    biology: [
        { title: 'Biology - Khan Academy', platform: 'Khan Academy', url: 'https://www.khanacademy.org/science/biology', effort: 'Self-paced', isFree: true, tags: ['biology', 'NEET'] },
        { title: 'Introduction to Biology - edX', platform: 'edX', url: 'https://www.edx.org/course/introduction-to-biology', effort: '8 weeks', isFree: false, tags: ['biology', 'beginner'] },
        { title: 'NEET Biology Full Syllabus', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=XZhJq2s4K6g', effort: '30+ hours', isFree: true, tags: ['biology', 'NEET'] },
    ],
    programming: [
        { title: 'CS50 Introduction to Computer Science', platform: 'edX', url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', effort: '12 weeks', isFree: true, tags: ['programming', 'beginner'] },
        { title: 'The Odin Project', platform: 'freeCodeCamp', url: 'https://www.theodinproject.com', effort: '9 months', isFree: true, tags: ['web dev', 'full stack'] },
        { title: 'Problem Solving Through Programming in C - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/106105085', effort: '8 weeks', isFree: true, tags: ['programming', 'C', 'beginner'] },
    ],
    'web development': [
        { title: 'The Web Developer Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/the-web-developer-bootcamp/', effort: '74 hours', isFree: false, tags: ['web dev', 'full stack'] },
        { title: 'Responsive Web Design', platform: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', effort: '300 hours', isFree: true, tags: ['web dev', 'HTML', 'CSS'] },
        { title: 'HTML & CSS Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=916GWv2Qs08', effort: '5 hours', isFree: true, tags: ['HTML', 'CSS', 'beginner'] },
    ],
    'deep learning': [
        { title: 'Deep Learning Specialization by Andrew Ng', platform: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning', effort: '5 months', isFree: false, tags: ['deep learning', 'AI', 'advanced'] },
        { title: 'Neural Networks: Zero to Hero - Karpathy', platform: 'YouTube', url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ', effort: '10+ hours', isFree: true, tags: ['deep learning', 'neural networks'] },
        { title: 'Deep Learning - NPTEL', platform: 'NPTEL', url: 'https://nptel.ac.in/courses/106106184', effort: '12 weeks', isFree: true, tags: ['deep learning', 'intermediate'] },
    ],
    git: [
        { title: 'Git & GitHub Crash Course', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk', effort: '1 hour', isFree: true, tags: ['git', 'version control', 'beginner'] },
        { title: 'Introduction to Git and GitHub', platform: 'Coursera', url: 'https://www.coursera.org/learn/introduction-git-github', effort: '4 weeks', isFree: false, tags: ['git', 'beginner'] },
    ],
    'career development': [
        { title: 'Career Success Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/career-success', effort: '5 months', isFree: false, tags: ['career', 'soft skills'] },
        { title: 'How to Build a Career in STEM - YouTube', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=9vBxnFjp0Z8', effort: '1 hour', isFree: true, tags: ['career', 'STEM'] },
    ],
    'college application': [
        { title: 'How to Ace Your College Application', platform: 'YouTube', url: 'https://www.youtube.com/watch?v=cbmN6TO_Hug', effort: '45 mins', isFree: true, tags: ['college', 'application'] },
        { title: 'College Admissions Guide - Khan Academy', platform: 'Khan Academy', url: 'https://www.khanacademy.org/college-careers-more/college-admissions', effort: 'Self-paced', isFree: true, tags: ['college', 'admissions'] },
    ],
    default: [
        { title: 'Learning How to Learn', platform: 'Coursera', url: 'https://www.coursera.org/learn/learning-how-to-learn', effort: '4 weeks', isFree: false, tags: ['study skills', 'beginner'] },
        { title: 'Khan Academy - Free Learning', platform: 'Khan Academy', url: 'https://www.khanacademy.org', effort: 'Self-paced', isFree: true, tags: ['general', 'free'] },
        { title: 'NPTEL Courses Directory', platform: 'NPTEL', url: 'https://nptel.ac.in/course.html', effort: 'Varies', isFree: true, tags: ['engineering', 'science'] },
    ],
}

// Match keywords from milestone title + description + tasks
const matchCourses = (milestone: IMilestone): CourseRecommendation[] => {
    const text = `${milestone.title} ${milestone.description} ${milestone.tasks.join(' ')}`.toLowerCase()
    const matched = new Set<CourseRecommendation>()

    const priorityKeys = Object.keys(COURSE_DATABASE).filter((k) => k !== 'default')
    priorityKeys.forEach((key) => {
        if (text.includes(key)) {
            COURSE_DATABASE[key].forEach((c) => matched.add(c))
        }
    })

    // Check secondary keywords
    if (text.includes('jee') || text.includes('maths') || text.includes('math')) COURSE_DATABASE.mathematics?.forEach((c) => matched.add(c))
    if (text.includes('neet') || text.includes('biology')) COURSE_DATABASE.biology?.forEach((c) => matched.add(c))
    if (text.includes('code') || text.includes('coding') || text.includes('program')) COURSE_DATABASE.programming?.forEach((c) => matched.add(c))
    if (text.includes('github') || text.includes('version control')) COURSE_DATABASE.git?.forEach((c) => matched.add(c))
    if (text.includes('ai') || text.includes('artificial intelligence')) COURSE_DATABASE['machine learning']?.forEach((c) => matched.add(c))
    if (text.includes('web') || text.includes('html') || text.includes('css')) COURSE_DATABASE['web development']?.forEach((c) => matched.add(c))

    const results = Array.from(matched)

    if (results.length === 0) {
        return COURSE_DATABASE.default
    }

    // Prioritize free courses + deduplicate by title, return max 5
    const seen = new Set<string>()
    return results
        .filter((c) => { const ok = !seen.has(c.title); seen.add(c.title); return ok })
        .sort((a, b) => Number(b.isFree) - Number(a.isFree))
        .slice(0, 5)
}

// AI-powered course suggestions (used when Gemini key is set)
const getAICourses = async (milestone: IMilestone): Promise<CourseRecommendation[]> => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const prompt = `You are a career counselor for Indian students. Suggest 4-5 high-quality online courses for this learning milestone.

Milestone: "${milestone.title}"
Description: "${milestone.description}"
Tasks: ${milestone.tasks.slice(0, 3).join(', ')}

Return a JSON array. Each course must have:
- title: string (actual course name)
- platform: one of "Coursera" | "NPTEL" | "YouTube" | "freeCodeCamp" | "Khan Academy" | "edX"
- url: string (real, working URL)
- effort: string (e.g., "4 weeks", "10 hours", "Self-paced")
- isFree: boolean
- tags: string[] (2-3 keywords)

Return ONLY valid JSON array, no markdown.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/^```json?\s*/i, '').replace(/\s*```$/, '')
    return JSON.parse(text)
}

export const getCoursesForMilestone = async (milestone: IMilestone): Promise<CourseRecommendation[]> => {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey && apiKey.length > 10) {
        try {
            return await getAICourses(milestone)
        } catch (err) {
            console.warn('AI course generation failed, using curated fallback:', err)
        }
    }
    return matchCourses(milestone)
}

// AI-powered per-task resource finder via Gemini
const getAITaskResources = async (taskText: string, milestone: IMilestone): Promise<CourseRecommendation[]> => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const prompt = `You are a career counselor for Indian students. A student needs help finding resources for a specific task in their learning roadmap.

Milestone: "${milestone.title}"
Specific Task: "${taskText}"

Suggest 3-4 high-quality, real online resources (courses, videos, articles, tools) that directly help with this specific task. The resources should be very specific to the task, not generic.

Return a JSON array. Each resource must have:
- title: string (actual resource name)
- platform: one of "Coursera" | "NPTEL" | "YouTube" | "freeCodeCamp" | "Khan Academy" | "Udemy" | "edX"
- url: string (real, working URL)
- effort: string (e.g., "4 weeks", "10 hours", "Self-paced", "30 mins")
- isFree: boolean
- tags: string[] (2-3 keywords relevant to the task)

Return ONLY valid JSON array, no markdown.`

    console.log(`🔍 Calling Gemini for task resources: "${taskText.substring(0, 50)}..."`)
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/^```json?\s*/i, '').replace(/\s*```$/, '')
    const resources = JSON.parse(text)
    console.log(`✅ Gemini returned ${resources.length} resources for task`)
    return resources
}

// Per-task resource helper: uses Gemini AI with hardcoded fallback
export const getResourcesForTaskText = async (taskText: string, milestone: IMilestone): Promise<CourseRecommendation[]> => {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey && apiKey.length > 10) {
        try {
            return await getAITaskResources(taskText, milestone)
        } catch (err) {
            console.warn('⚠️ AI task resource generation failed, using curated fallback:', err)
        }
    }

    // Fallback: keyword matching against curated database
    const text = `${taskText} ${milestone.title}`.toLowerCase()
    const matched = new Set<CourseRecommendation>()

    const priorityKeys = Object.keys(COURSE_DATABASE).filter((k) => k !== 'default')
    priorityKeys.forEach((key) => {
        if (text.includes(key)) {
            COURSE_DATABASE[key].forEach((c) => matched.add(c))
        }
    })

    if (text.includes('jee') || text.includes('maths') || text.includes('math')) COURSE_DATABASE.mathematics?.forEach((c) => matched.add(c))
    if (text.includes('neet') || text.includes('biology')) COURSE_DATABASE.biology?.forEach((c) => matched.add(c))
    if (text.includes('sat') || text.includes('act') || text.includes('test') || text.includes('exam')) COURSE_DATABASE['college application']?.forEach((c) => matched.add(c))
    if (text.includes('code') || text.includes('coding') || text.includes('program')) COURSE_DATABASE.programming?.forEach((c) => matched.add(c))
    if (text.includes('university') || text.includes('college') || text.includes('shortlist')) COURSE_DATABASE['college application']?.forEach((c) => matched.add(c))

    const results = Array.from(matched)
    if (results.length === 0) return COURSE_DATABASE.default.slice(0, 3)

    const seen = new Set<string>()
    return results
        .filter((c) => { const ok = !seen.has(c.title); seen.add(c.title); return ok })
        .sort((a, b) => Number(b.isFree) - Number(a.isFree))
        .slice(0, 3)
}
