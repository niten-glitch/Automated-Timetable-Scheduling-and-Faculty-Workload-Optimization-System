const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    slot: {
        type: Number,
        required: true,
    },
    startTime: {
        type: String,
        required: false
    },
    endTime: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
