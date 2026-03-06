import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import quizRoutes from './routes/quiz.routes'
import careerRoutes from './routes/career.routes'
import roadmapRoutes from './routes/roadmap.routes'
import courseRoutes from './routes/course.routes'
import counselorRoutes from './routes/counselor.routes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// Security & logging
app.use(helmet())
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))

// CORS — allow Vite dev server and production
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL || 'http://localhost:5173',
        ],
        credentials: true,
    })
)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Mentora API is running 🚀', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/careers', careerRoutes)
app.use('/api/roadmap', roadmapRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/counselor', counselorRoutes)

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler (must be last)
app.use(errorHandler)

export default app
