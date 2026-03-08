import mongoose, { Schema, Document } from 'mongoose'

export interface IAptitudeQuestion extends Document {
    text: string
    options: string[]
    correctOption: number
    difficulty: number // 1-5
    category: 'logical' | 'analytical' | 'quantitative' | 'verbal'
    explanation?: string
}

const AptitudeQuestionSchema = new Schema<IAptitudeQuestion>(
    {
        text: { type: String, required: true },
        options: { type: [String], required: true },
        correctOption: { type: Number, required: true },
        difficulty: { type: Number, required: true, min: 1, max: 5 },
        category: { type: String, required: true, enum: ['logical', 'analytical', 'quantitative', 'verbal'] },
        explanation: { type: String },
    },
    { timestamps: true }
)

export const AptitudeQuestion = mongoose.model<IAptitudeQuestion>('AptitudeQuestion', AptitudeQuestionSchema)
