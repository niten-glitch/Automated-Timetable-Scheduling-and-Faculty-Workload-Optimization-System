const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    studentCount: {
        type: Number,
        required: true,
    },
    program: {
        type: String,
        required: false, // Optional for backward compatibility
    },
    batch: {
        type: String,
        required: false, // Optional for backward compatibility
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Section', sectionSchema);
