const Timetable = require('../models/Timetable');
const Conflict = require('../models/Conflict');

const detectConflicts = async () => {
    const conflicts = [];
    const entries = await Timetable.find();

    for (const entry of entries) {
        // Faculty conflict
        const facultyConflict = await Timetable.findOne({
            facultyId: entry.facultyId,
            timeslotId: entry.timeslotId,
            _id: { $ne: entry._id },
        });

        if (facultyConflict) {
            conflicts.push({
                type: 'faculty',
                entityId: entry.facultyId,
                timeslotId: entry.timeslotId,
                reason: 'Faculty double booked',
            });
        }

        // Room conflict
        const roomConflict = await Timetable.findOne({
            roomId: entry.roomId,
            timeslotId: entry.timeslotId,
            _id: { $ne: entry._id },
        });

        if (roomConflict) {
            conflicts.push({
                type: 'room',
                entityId: entry.roomId,
                timeslotId: entry.timeslotId,
                reason: 'Room double booked',
            });
        }

        // Section conflict
        const sectionConflict = await Timetable.findOne({
            sectionId: entry.sectionId,
            timeslotId: entry.timeslotId,
            _id: { $ne: entry._id },
        });

        if (sectionConflict) {
            conflicts.push({
                type: 'section',
                entityId: entry.sectionId,
                timeslotId: entry.timeslotId,
                reason: 'Section overlap',
            });
        }
    }

    // Save conflicts to database
    if (conflicts.length > 0) {
        await Conflict.insertMany(conflicts);
    }

    return conflicts;
};

module.exports = { detectConflicts };
