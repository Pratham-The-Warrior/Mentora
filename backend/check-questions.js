const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

async function checkQuestions() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to:', uri.split('@')[1]); // Log host part only for security
        await mongoose.connect(uri);
        const Question = mongoose.model('Question', new Schema({}, { strict: false }), 'aptitudequestions');

        const total = await Question.countDocuments();
        const byCategory = await Question.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        console.log(JSON.stringify({ total, byCategory }, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
}

checkQuestions();
