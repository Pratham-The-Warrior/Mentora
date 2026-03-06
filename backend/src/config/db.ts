import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI

    if (!uri) {
        console.error('❌ MONGODB_URI is not set in .env file')
        process.exit(1)
    }

    try {
        const conn = await mongoose.connect(uri)
        console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error)
        process.exit(1)
    }
}

export default connectDB
