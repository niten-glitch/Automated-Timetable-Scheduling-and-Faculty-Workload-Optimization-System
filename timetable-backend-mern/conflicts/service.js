const Timetable = require('../models/Timetable');
const Conflict = require('../models/Conflict');

/**
 * Detects conflicts in the current timetable.
 * Clears existing conflicts first to ensure freshness.
 * Returns an array of detected conflicts.
 */
const detectConflicts = async (proposalId) => {
    // 1. Clear existing conflicts
    if (proposalId) {
        await Conflict.deleteMany({ proposalId });
    } else {
        await Conflict.deleteMany({});
    }

    const conflicts = [];
    const query = proposalId ? { proposalId } : {};

    // Fetch all timetable entries
    // Ensure we populate correctly to get names and details
    const entries = await Timetable.find(query)
        .populate('facultyId', 'name')
        .populate('roomId', 'roomType capacity')
        .populate('sectionId', 'name')
        .populate('courseId', 'name courseType')
        .populate('timeslotId', 'day slot startTime endTime');

    // Maps to group entries by Resource + Timeslot
    // Key format: `${proposalId}_${resourceId}_${timeslotId}`
    const facultyMap = new Map();
    const roomMap = new Map();
    const sectionMap = new Map();

    for (const entry of entries) {
        // Validation: skip if essential relations are missing (e.g. deleted refs)
        if (!entry.timeslotId || !entry.facultyId || !entry.roomId || !entry.sectionId) continue;
        if (!entry.proposalId) continue; // Should have one

        const tid = entry.timeslotId._id.toString();
        const pid = entry.proposalId.toString();

        // 1. Faculty Grouping
        const fKey = `${pid}_${entry.facultyId._id.toString()}_${tid}`;
        if (!facultyMap.has(fKey)) facultyMap.set(fKey, []);
        facultyMap.get(fKey).push(entry);

        // 2. Room Grouping
        const rKey = `${pid}_${entry.roomId._id.toString()}_${tid}`;
        if (!roomMap.has(rKey)) roomMap.set(rKey, []);
        roomMap.get(rKey).push(entry);

        // 3. Section Grouping
        const sKey = `${pid}_${entry.sectionId._id.toString()}_${tid}`;
        if (!sectionMap.has(sKey)) sectionMap.set(sKey, []);
        sectionMap.get(sKey).push(entry);
    }

    // Helper to process groups
    const processGroups = (map, type, getReason) => {
        for (const [key, group] of map) {
            if (group.length > 1) {
                // Conflict Found!
                const sample = group[0];
                const entityId = type === 'faculty' ? sample.facultyId._id :
                    type === 'room' ? sample.roomId._id : sample.sectionId._id;

                // Construct a detailed reason
                // e.g. "Faculty John Doe has 2 classes: Math (Slot 1), Physics (Slot 1)"
                // Actually constraint is SAME timeslot, so slot is implied.
                // "Faculty John Doe has 3 classes at 10:00 AM: Math, Physics, Chem"

                const courseNames = group.map(e => e.courseId ? e.courseId.name : 'Unknown').join(', ');
                const timeStr = sample.timeslotId.startTime ? `${sample.timeslotId.startTime} - ${sample.timeslotId.endTime}` : `Slot ${sample.timeslotId.slot}`;

                let reason = '';
                if (type === 'faculty') {
                    reason = `Faculty ${sample.facultyId.name} is double-booked for ${group.length} classes: ${courseNames}`;
                } else if (type === 'room') {
                    reason = `Room ${sample.roomId.roomType} (Cap: ${sample.roomId.capacity}) has ${group.length} classes: ${courseNames}`;
                } else {
                    reason = `Section ${sample.sectionId.name} has ${group.length} concurrent classes: ${courseNames}`;
                }

                conflicts.push({
                    type: type,
                    entityId: entityId,
                    timeslotId: sample.timeslotId._id,
                    reason: reason,
                    proposalId: sample.proposalId,
                    // Optional: store individual entry IDs for debugging
                    details: { entryIds: group.map(g => g._id) }
                });
            }
        }
    };

    processGroups(facultyMap, 'faculty');
    processGroups(roomMap, 'room');
    processGroups(sectionMap, 'section');

    // Save to DB
    if (conflicts.length > 0) {
        const dbConflicts = conflicts.map(c => ({
            type: c.type,
            entityId: c.entityId,
            timeslotId: c.timeslotId,
            reason: c.reason,
            proposalId: c.proposalId
        }));
        await Conflict.insertMany(dbConflicts);
    }

    return conflicts;
};

const getConflicts = async (proposalId) => {
    const query = {};
    if (proposalId) {
        query.proposalId = proposalId;
    }
    return await Conflict.find(query)
        .populate('entityId')
        .populate('timeslotId');
};

module.exports = {
    detectConflicts,
    getConflicts
};
