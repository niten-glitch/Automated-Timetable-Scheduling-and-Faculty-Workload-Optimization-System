const mongoose = require('mongoose');

const facultyAvailabilitySchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
    },
    timeslotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimeSlot',
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('FacultyAvailability', facultyAvailabilitySchema);
