const Timetable = require('../models/Timetable');
const Conflict = require('../models/Conflict');

/**
 * Detects conflicts in the current timetable.
 * Clears existing conflicts first to ensure freshness.
 * Returns an array of detected conflicts.
 */
const detectConflicts = async () => {
    // 1. Clear existing conflicts
    await Conflict.deleteMany({});

    const conflicts = [];
    // Fetch all timetable entries
    const entries = await Timetable.find().populate('facultyId roomId sectionId timeslotId');

    // Simple O(N^2) check or optimized query - relying on optimized query concepts or iteration
    // Since we need specific reasons, iteration is straightforward for this scale.
    // For large datasets, we would aggregate.



    for (let i = 0; i < entries.length; i++) {
        const entryA = entries[i];

        // Skip entries with missing populated fields or missing _id properties
        if (!entryA.timeslotId || !entryA.timeslotId._id ||
            !entryA.facultyId || !entryA.facultyId._id ||
            !entryA.roomId || !entryA.roomId._id ||
            !entryA.sectionId || !entryA.sectionId._id) {
            continue;
        }

        for (let j = i + 1; j < entries.length; j++) {
            const entryB = entries[j];

            // Skip entries with missing populated fields or missing _id properties
            if (!entryB.timeslotId || !entryB.timeslotId._id ||
                !entryB.facultyId || !entryB.facultyId._id ||
                !entryB.roomId || !entryB.roomId._id ||
                !entryB.sectionId || !entryB.sectionId._id) {
                continue;
            }

            // Must be in the same timeslot to clash
            // Assuming timeslotId is an object, compare strings
            if (entryA.timeslotId._id.toString() !== entryB.timeslotId._id.toString()) {
                continue;
            }

            // 1. Faculty Clash
            if (entryA.facultyId._id.toString() === entryB.facultyId._id.toString()) {
                conflicts.push({
                    type: 'faculty',
                    entityId: entryA.facultyId._id,
                    timeslotId: entryA.timeslotId._id,
                    reason: `Faculty ${entryA.facultyId.name} is double booked in Room ${entryA.roomId.roomType} and ${entryB.roomId.roomType}`,
                    details: {
                        entryA: entryA._id,
                        entryB: entryB._id
                    }
                });
            }

            // 2. Room Clash
            if (entryA.roomId._id.toString() === entryB.roomId._id.toString()) {
                conflicts.push({
                    type: 'room',
                    entityId: entryA.roomId._id,
                    timeslotId: entryA.timeslotId._id,
                    reason: `Room ${entryA.roomId.roomType} (Capacity: ${entryA.roomId.capacity}) is double booked for ${entryA.courseId} and ${entryB.courseId}`,
                    details: {
                        entryA: entryA._id,
                        entryB: entryB._id
                    }
                });
            }

            // 3. Section Clash
            if (entryA.sectionId._id.toString() === entryB.sectionId._id.toString()) {
                conflicts.push({
                    type: 'section',
                    entityId: entryA.sectionId._id,
                    timeslotId: entryA.timeslotId._id,
                    reason: `Section ${entryA.sectionId.name} has two classes scheduled at the same time: ${entryA.courseId} and ${entryB.courseId}`,
                    details: {
                        entryA: entryA._id,
                        entryB: entryB._id
                    }
                });
            }
        }
    }

    // Remove duplicates if any (though the loop pairing prevents A-B and B-A duplicates, double booking A-B-C might produce A-B, A-C, B-C which is correct)

    // Save to DB
    if (conflicts.length > 0) {
        // We only save the main schema fields
        const dbConflicts = conflicts.map(c => ({
            type: c.type,
            entityId: c.entityId,
            timeslotId: c.timeslotId,
            reason: c.reason
        }));
        await Conflict.insertMany(dbConflicts);
    }

    return conflicts;
};

const getConflicts = async () => {
    return await Conflict.find()
        .populate('entityId') // This might fail if entityId references dynamic collections (polymorphic). 
        // Conflict model schema says: entityId: Schema.Types.ObjectId. It doesn't specify 'ref'.
        // We need to handle population manually or fix the schema if we want auto-pop.
        // For now, return as is, or rely on client to looking up IDs.
        .populate('timeslotId');
};

module.exports = {
    detectConflicts,
    getConflicts
};
