const Timetable = require('../models/Timetable');
const FacultyAvailability = require('../models/FacultyAvailability');

// ---------- HELPER CHECKS ----------

const isFacultyAvailable = async (facultyId, timeslotId) => {
    const availability = await FacultyAvailability.findOne({
        facultyId,
        timeslotId,
        isAvailable: true,
    });
    return availability !== null;
};

const hasFacultyClash = async (facultyId, timeslotId) => {
    const clash = await Timetable.findOne({
        facultyId,
        timeslotId,
    });
    return clash !== null;
};

const hasRoomClash = async (roomId, timeslotId) => {
    const clash = await Timetable.findOne({
        roomId,
        timeslotId,
    });
    return clash !== null;
};

const hasSectionClash = async (sectionId, timeslotId) => {
    const clash = await Timetable.findOne({
        sectionId,
        timeslotId,
    });
    return clash !== null;
};

// ---------- CORE GENERATOR ----------

const generateTimetable = async (sections, sectionCourses, faculties, rooms, timeslots) => {
    /**
     * sectionCourses: Object { sectionId: [Course, Course, ...] }
     */

    const timetableEntries = [];

    // Clear old timetable (important for reruns)
    await Timetable.deleteMany({});

    for (const section of sections) {
        const courses = sectionCourses[section._id.toString()] || [];

        for (const course of courses) {
            let assigned = false;

            for (const timeslot of timeslots) {
                // Section cannot have two classes at same time
                if (await hasSectionClash(section._id, timeslot._id)) {
                    continue;
                }

                for (const faculty of faculties) {
                    if (!(await isFacultyAvailable(faculty._id, timeslot._id))) {
                        continue;
                    }

                    if (await hasFacultyClash(faculty._id, timeslot._id)) {
                        continue;
                    }

                    for (const room of rooms) {
                        // HARD CONSTRAINTS
                        if (room.capacity < section.studentCount) {
                            continue;
                        }

                        if (room.roomType !== course.courseType) {
                            continue;
                        }

                        if (await hasRoomClash(room._id, timeslot._id)) {
                            continue;
                        }

                        // ✅ ALL HARD CONSTRAINTS SATISFIED
                        const entry = new Timetable({
                            sectionId: section._id,
                            courseId: course._id,
                            facultyId: faculty._id,
                            roomId: room._id,
                            timeslotId: timeslot._id,
                        });

                        await entry.save();
                        timetableEntries.push(entry);
                        assigned = true;
                        break;
                    }

                    if (assigned) {
                        break;
                    }
                }
                if (assigned) {
                    break;
                }
            }

            if (!assigned) {
                console.log(`Warning: No feasible slot for course ${course.name} in section ${section.name}`);
            }
        }
    }

    // Convert to plain objects for JSON serialization
    return timetableEntries.map((entry) => ({
        id: entry._id,
        sectionId: entry.sectionId,
        courseId: entry.courseId,
        facultyId: entry.facultyId,
        roomId: entry.roomId,
        timeslotId: entry.timeslotId,
    }));
};

module.exports = {
    generateTimetable,
    isFacultyAvailable,
    hasFacultyClash,
    hasRoomClash,
    hasSectionClash,
};
