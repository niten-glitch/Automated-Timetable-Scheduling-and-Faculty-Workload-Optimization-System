const mongoose = require('mongoose');

const conflictSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['faculty', 'room', 'section'],
        required: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    timeslotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Conflict', conflictSchema);
