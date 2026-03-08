import mongoose, { Schema, Document } from 'mongoose'

export interface ICareer extends Document {
    title: string
    description: string
    skills: string[]
    salaryRange: { min: number; max: number; currency: string }
    growthPotential: 'High' | 'Medium' | 'Low'
    categories: string[]
    icon: string
    relatedExams: string[]
    aptitudeRequirements: {
        logical: number;
        analytical: number;
        quantitative: number;
        verbal: number;
    }
}

const CareerSchema = new Schema<ICareer>(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        skills: { type: [String], default: [] },
        salaryRange: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
            currency: { type: String, default: 'INR' },
        },
        growthPotential: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
        categories: { type: [String], default: [] },
        aptitudeRequirements: {
            logical: { type: Number, default: 3 },
            analytical: { type: Number, default: 3 },
            quantitative: { type: Number, default: 3 },
            verbal: { type: Number, default: 3 },
        },
    },
    { timestamps: true }
)

export const Career = mongoose.model<ICareer>('Career', CareerSchema)
