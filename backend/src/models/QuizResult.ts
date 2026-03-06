import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizResult extends Document {
    userId: mongoose.Types.ObjectId
    answers: Record<number, number>
    scores: {
        analytical: number
        creative: number
        technical: number
        social: number
        practical: number
    }
    topCategory: string
    createdAt: Date
}

const QuizResultSchema = new Schema<IQuizResult>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        answers: { type: Map, of: Number, required: true },
        scores: {
            analytical: { type: Number, default: 0 },
            creative: { type: Number, default: 0 },
            technical: { type: Number, default: 0 },
            social: { type: Number, default: 0 },
            practical: { type: Number, default: 0 },
        },
        topCategory: { type: String, required: true },
    },
    { timestamps: true }
)

export const QuizResult = mongoose.model<IQuizResult>('QuizResult', QuizResultSchema)
