import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizResult extends Document {
    userId: mongoose.Types.ObjectId
    answers: Record<string, any>
    scores: {
        logical: number
        analytical: number
        quantitative: number
        verbal: number
    }
    recommendations: {
        careerTitle: string
        matchScore: number
        aiReasoning: string
    }[]
    topCategory: string
    createdAt: Date
}

const QuizResultSchema = new Schema<IQuizResult>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        answers: { type: Schema.Types.Mixed, default: {} },
        scores: {
            logical: { type: Number, default: 0 },
            analytical: { type: Number, default: 0 },
            quantitative: { type: Number, default: 0 },
            verbal: { type: Number, default: 0 },
        },
        recommendations: [{
            careerTitle: { type: String, required: true },
            matchScore: { type: Number, required: true },
            aiReasoning: { type: String, required: true },
        }],
        topCategory: { type: String, required: true },
    },
    { timestamps: true }
)

export const QuizResult = mongoose.model<IQuizResult>('QuizResult', QuizResultSchema)
