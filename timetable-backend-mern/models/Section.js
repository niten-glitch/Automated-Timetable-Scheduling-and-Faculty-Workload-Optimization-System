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
}, {
    timestamps: true,
});

module.exports = mongoose.model('Section', sectionSchema);
