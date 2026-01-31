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
}, {
    timestamps: true,
});

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
