import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import connectDB from './config/db'

const PORT = parseInt(process.env.PORT || '5000', 10)

const startServer = async () => {
    await connectDB()

    app.listen(PORT, () => {
        console.log(` Mentora backend running at http://localhost:${PORT}`)
        console.log(` Environment: ${process.env.NODE_ENV || 'development'}`)
        console.log(` Gemini AI: ${process.env.GEMINI_API_KEY ? 'Enabled ✅' : 'Using fallback 📋'}`)
    })
}

startServer().catch((err) => {
    console.error('❌ Failed to start server:', err)
    process.exit(1)
})
