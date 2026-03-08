import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Career } from './models/Career'
import { AptitudeQuestion } from './models/AptitudeQuestion'

const careers = [
    {
        title: 'Software Engineer',
        description: 'Design, develop, and maintain software systems and applications. One of the highest-demand careers globally with excellent remote work opportunities.',
        skills: ['Programming (Python/Java/C++)', 'Data Structures & Algorithms', 'System Design', 'Git', 'Problem Solving'],
        salaryRange: { min: 600000, max: 4000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['technical', 'analytical'],
        icon: '💻',
        relatedExams: ['JEE Main & Advanced', 'BITSAT', 'SAT/ACT (US)'],
        aptitudeRequirements: { logical: 4, analytical: 5, quantitative: 4, verbal: 3 }
    },
    {
        title: 'Data Scientist',
        description: 'Extract insights from large datasets using statistics, machine learning, and visualization. A booming field at the intersection of math, programming, and business.',
        skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization', 'TensorFlow/PyTorch'],
        salaryRange: { min: 800000, max: 5000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['technical', 'analytical'],
        icon: '📊',
        relatedExams: ['JEE Main & Advanced', 'BITSAT', 'SAT/ACT (US)'],
        aptitudeRequirements: { logical: 4, analytical: 5, quantitative: 5, verbal: 3 }
    },
    {
        title: 'AI/ML Engineer',
        description: 'Build intelligent systems using deep learning, natural language processing, and computer vision. At the forefront of the modern technological revolution.',
        skills: ['Deep Learning', 'Python', 'Neural Networks', 'NLP', 'Computer Vision', 'Cloud Platforms'],
        salaryRange: { min: 1000000, max: 6000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['technical', 'analytical', 'creative'],
        icon: '🤖',
        relatedExams: ['JEE Main & Advanced', 'BITSAT', 'SAT/ACT (US)'],
        aptitudeRequirements: { logical: 5, analytical: 5, quantitative: 4, verbal: 3 }
    },
    {
        title: 'Medicine (MBBS/MD)',
        description: 'Diagnose and treat patients across diverse medical specializations. A deeply impactful career dedicated to healing and improving human health.',
        skills: ['Clinical Knowledge', 'Anatomy & Physiology', 'Patient Communication', 'Critical Thinking', 'Biology & Chemistry'],
        salaryRange: { min: 700000, max: 4000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['social', 'practical'],
        icon: '🩺',
        relatedExams: ['NEET'],
        aptitudeRequirements: { logical: 4, analytical: 4, quantitative: 3, verbal: 4 }
    },
    {
        title: 'Biotechnology Researcher',
        description: 'Use biological systems and living organisms to develop products and solutions in healthcare, agriculture, and environmental science.',
        skills: ['Molecular Biology', 'Genetics', 'Lab Techniques', 'Research Methodology', 'Data Analysis'],
        salaryRange: { min: 500000, max: 2500000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['analytical', 'creative', 'practical'],
        icon: '🧬',
        relatedExams: ['NEET', 'JEE Main & Advanced'],
        aptitudeRequirements: { logical: 4, analytical: 5, quantitative: 3, verbal: 3 }
    },
    {
        title: 'Aerospace Engineer',
        description: 'Design aircraft, spacecraft, satellites, and defense systems. Work with ISRO, NASA, or leading aerospace companies to push the boundaries of human exploration.',
        skills: ['Aerodynamics', 'Thermodynamics', 'CAD/CAM', 'Propulsion Systems', 'Mathematics', 'Physics'],
        salaryRange: { min: 600000, max: 3500000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['technical', 'analytical', 'practical'],
        icon: '🚀',
        relatedExams: ['JEE Main & Advanced', 'BITSAT'],
        aptitudeRequirements: { logical: 4, analytical: 4, quantitative: 5, verbal: 3 }
    },
    {
        title: 'Robotics Engineer',
        description: 'Design, build, and program robots for manufacturing, healthcare, exploration, and entertainment. A hands-on career combining mechanics, electronics, and software.',
        skills: ['Robotics Programming', 'Mechanical Design', 'Electronics', 'Computer Vision', 'Control Systems', 'Python/C++'],
        salaryRange: { min: 700000, max: 4000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['technical', 'creative', 'practical'],
        icon: '🦾',
        relatedExams: ['JEE Main & Advanced', 'BITSAT', 'SAT/ACT (US)'],
        aptitudeRequirements: { logical: 5, analytical: 4, quantitative: 4, verbal: 2 }
    },
    {
        title: 'UX/UI Designer',
        description: 'Create intuitive, beautiful digital experiences for apps and websites. Bridge the gap between user needs and technical implementation through research and design.',
        skills: ['Figma/Sketch', 'User Research', 'Prototyping', 'Design Thinking', 'HTML/CSS basics', 'Accessibility'],
        salaryRange: { min: 500000, max: 3000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['creative', 'social'],
        icon: '🎨',
        relatedExams: ['SAT/ACT (US)', 'A-Levels (UK)'],
        aptitudeRequirements: { logical: 3, analytical: 4, quantitative: 2, verbal: 4 }
    }
]

const questions = [
    // LOGICAL
    {
        text: "If all Bloops are Razzies and all Razzies are Lurgis, then all Bloops are definitely Lurgis.",
        options: ["True", "False", "Cannot be determined", "Only if Lurgis are Bloops"],
        correctOption: 0,
        difficulty: 1,
        category: 'logical',
        explanation: "This is a classic syllogism: A=B, B=C, therefore A=C."
    },
    {
        text: "Find the next number in the sequence: 2, 6, 12, 20, 30, ...",
        options: ["36", "40", "42", "44"],
        correctOption: 2,
        difficulty: 2,
        category: 'logical',
        explanation: "The differences are 4, 6, 8, 10... so the next difference is 12. 30 + 12 = 42."
    },
    {
        text: "In a certain code, 'LIGHT' is written as 'MJHIU'. How is 'FRAME' written in that code?",
        options: ["GSBNF", "GRBNF", "GSBMF", "HTCPF"],
        correctOption: 0,
        difficulty: 3,
        category: 'logical',
        explanation: "Each letter is shifted by +1 (L->M, I->J, G->H...). F->G, R->S, A->B, M->N, E->F."
    },
    {
        text: "A is the brother of B. B is the daughter of C. D is the father of C. How is A related to D?",
        options: ["Grandson", "Grandfather", "Son", "Brother"],
        correctOption: 0,
        difficulty: 4,
        category: 'logical',
        explanation: "C is A's parent. D is C's father. So D is A's grandfather, and A is D's grandson."
    },
    {
        text: "Five people (A, B, C, D, E) are sitting in a row. A is to the left of B but right of C. D is to the right of B but left of E. Who is in the middle?",
        options: ["A", "B", "C", "D"],
        correctOption: 1,
        difficulty: 5,
        category: 'logical',
        explanation: "The order is C, A, B, D, E. B is in the middle."
    },

    // QUANTITATIVE
    {
        text: "What is 15% of 200?",
        options: ["20", "25", "30", "35"],
        correctOption: 2,
        difficulty: 1,
        category: 'quantitative'
    },
    {
        text: "A train covers 180 km in 3 hours. What is its speed in m/s?",
        options: ["16.67 m/s", "20.00 m/s", "25.00 m/s", "30.00 m/s"],
        correctOption: 0,
        difficulty: 3,
        category: 'quantitative',
        explanation: "Speed = 180/3 = 60 km/h. To convert to m/s, multiply by 5/18: 60 * 5/18 = 16.67 m/s."
    },
    {
        text: "If 3x + 5 = 20, what is the value of x?",
        options: ["3", "5", "7", "15"],
        correctOption: 1,
        difficulty: 2,
        category: 'quantitative'
    },
    {
        text: "The ratio of the ages of A and B is 4:3. If A will be 24 years old in 4 years, how old is B now?",
        options: ["12", "15", "18", "21"],
        correctOption: 1,
        difficulty: 4,
        category: 'quantitative',
        explanation: "A's age in 4 years = 24, so A is 20 now. Ratio A:B = 4:3. If A=20 (4*5), then B=3*5=15."
    },

    // ANALYTICAL
    {
        text: "Which of the following is most similar to: Apple, Orange, Banana?",
        options: ["Potato", "Carrot", "Grape", "Broccoli"],
        correctOption: 2,
        difficulty: 1,
        category: 'analytical'
    },
    {
        text: "Identify the odd one out: Gold, Silver, Copper, Diamond",
        options: ["Gold", "Silver", "Copper", "Diamond"],
        correctOption: 3,
        difficulty: 2,
        category: 'analytical',
        explanation: "Diamond is a non-metal (carbon), while others are metals."
    },

    // VERBAL
    {
        text: "Choose the word most nearly opposite in meaning to: GENEROUS",
        options: ["Kind", "Stingy", "Happy", "Selfish"],
        correctOption: 1,
        difficulty: 2,
        category: 'verbal'
    },
    {
        text: "Complete the analogy: Book is to Author as Movie is to ...",
        options: ["Actor", "Director", "Producer", "Screenwriter"],
        correctOption: 1,
        difficulty: 3,
        category: 'verbal'
    }
]

const seedData = async () => {
    try {
        const uri = process.env.MONGODB_URI
        if (!uri) {
            console.error('❌ MONGODB_URI not set in .env')
            process.exit(1)
        }

        await mongoose.connect(uri)
        console.log('✅ Connected to MongoDB')

        // Careers
        await Career.deleteMany({})
        await Career.insertMany(careers)
        console.log(`✅ Seeded ${careers.length} careers`)

        // Questions
        await AptitudeQuestion.deleteMany({})
        await AptitudeQuestion.insertMany(questions)
        console.log(`✅ Seeded ${questions.length} aptitude questions`)

    } catch (error) {
        console.error('❌ Seeding failed:', error)
    } finally {
        await mongoose.disconnect()
        console.log('🔌 Disconnected from MongoDB')
        process.exit(0)
    }
}

seedData()
