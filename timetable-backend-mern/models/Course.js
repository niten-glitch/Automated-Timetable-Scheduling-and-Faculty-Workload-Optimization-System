const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    courseType: {
        type: String,
        enum: ['theory', 'lab'],
        required: true,
    },
    hoursPerWeek: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);
