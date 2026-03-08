const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

// Stub for currentDifficulties adjustment logic
function adjustDifficulty(current, isCorrect) {
    if (isCorrect) return Math.min(5, current + 1);
    return Math.max(1, current - 1);
}

// Stub for weighted scoring logic
function calculateScore(answers) {
    if (answers.length === 0) return 0;
    const totalDifficulty = answers.reduce((sum, a) => sum + a.difficulty, 0);
    const correctDifficulty = answers.filter(a => a.isCorrect).reduce((sum, a) => sum + a.difficulty, 0);
    return Math.round((correctDifficulty / totalDifficulty) * 5 * 10) / 10;
}

// Test cases
function runTests() {
    console.log('--- Running Logic Tests ---');

    // Test 1: All Correct
    const allCorrect = [
        { difficulty: 2, isCorrect: true },
        { difficulty: 3, isCorrect: true },
        { difficulty: 4, isCorrect: true }
    ];
    console.log('Test 1 (All Correct):', calculateScore(allCorrect) === 5.0 ? 'PASS' : `FAIL (${calculateScore(allCorrect)})`);

    // Test 2: Half Correct (Equal Difficulty)
    const halfCorrect = [
        { difficulty: 2, isCorrect: true },
        { difficulty: 2, isCorrect: false }
    ];
    console.log('Test 2 (Half Correct):', calculateScore(halfCorrect) === 2.5 ? 'PASS' : `FAIL (${calculateScore(halfCorrect)})`);

    // Test 3: Weighted Correct (Harder questions correct)
    const weightedCorrect = [
        { difficulty: 1, isCorrect: false },
        { difficulty: 4, isCorrect: true }
    ];
    // (4 / 5) * 5 = 4.0
    console.log('Test 3 (Weighted Correct):', calculateScore(weightedCorrect) === 4.0 ? 'PASS' : `FAIL (${calculateScore(weightedCorrect)})`);

    // Test 4: Weighted Incorrect (Easier questions correct)
    const weightedIncorrect = [
        { difficulty: 1, isCorrect: true },
        { difficulty: 4, isCorrect: false }
    ];
    // (1 / 5) * 5 = 1.0
    console.log('Test 4 (Weighted Incorrect):', calculateScore(weightedIncorrect) === 1.0 ? 'PASS' : `FAIL (${calculateScore(weightedIncorrect)})`);

    console.log('--- Tests Completed ---');
}

runTests();
