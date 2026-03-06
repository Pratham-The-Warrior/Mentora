import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { Career } from './models/Career'

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
    },
    {
        title: 'Environmental Scientist',
        description: 'Study the environment, analyze data on air, food, and water quality, and create solutions to environmental problems like climate change and pollution.',
        skills: ['Environmental Chemistry', 'GIS & Remote Sensing', 'Data Analysis', 'Field Research', 'Policy Knowledge'],
        salaryRange: { min: 400000, max: 2000000, currency: 'INR' },
        growthPotential: 'Medium',
        categories: ['analytical', 'practical', 'social'],
        icon: '🌿',
        relatedExams: ['JEE Main & Advanced', 'NEET'],
    },
    {
        title: 'Biomedical Engineer',
        description: 'Combine engineering principles with medical sciences to design diagnostic equipment, prosthetics, and healthcare technology that saves and improves lives.',
        skills: ['Biomedical Instrumentation', 'Anatomy & Physiology', 'Signal Processing', 'Material Science', 'Programming'],
        salaryRange: { min: 550000, max: 3000000, currency: 'INR' },
        growthPotential: 'High',
        categories: ['technical', 'practical', 'social'],
        icon: '🏥',
        relatedExams: ['JEE Main & Advanced', 'NEET', 'BITSAT'],
    },
]

const seedCareers = async () => {
    try {
        const uri = process.env.MONGODB_URI
        if (!uri) {
            console.error('❌ MONGODB_URI not set in .env')
            process.exit(1)
        }

        await mongoose.connect(uri)
        console.log('✅ Connected to MongoDB')

        await Career.deleteMany({})
        console.log('🗑️ Cleared existing careers')

        await Career.insertMany(careers)
        console.log(`✅ Seeded ${careers.length} careers successfully!`)

        careers.forEach((c) => console.log(`  - ${c.icon} ${c.title}`))
    } catch (error) {
        console.error('❌ Seeding failed:', error)
    } finally {
        await mongoose.disconnect()
        console.log('🔌 Disconnected from MongoDB')
        process.exit(0)
    }
}

seedCareers()
