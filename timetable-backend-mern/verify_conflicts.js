const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');
const Room = require('./models/Room');
const Faculty = require('./models/Faculty');
const Section = require('./models/Section');
const Course = require('./models/Course');
const TimeSlot = require('./models/TimeSlot');
const conflictService = require('./conflicts/service');
require('dotenv').config();

const run = async () => {
    let createdIds = {};
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        console.log('Creating test entities...');
        const room = await Room.create({ roomType: 'theory', capacity: 50 });
        createdIds.room = room._id;

        const faculty = await Faculty.create({ name: 'Test_Conflict_Faculty', maxLoad: 10 });
        createdIds.faculty = faculty._id;

        const section1 = await Section.create({ name: 'Test_Section_A', studentCount: 30 });
        createdIds.section1 = section1._id;

        const section2 = await Section.create({ name: 'Test_Section_B', studentCount: 30 });
        createdIds.section2 = section2._id;

        const course1 = await Course.create({ name: 'Test_Course_101', courseType: 'theory', hoursPerWeek: 3 });
        createdIds.course1 = course1._id;

        const course2 = await Course.create({ name: 'Test_Course_102', courseType: 'theory', hoursPerWeek: 3 });
        createdIds.course2 = course2._id;

        const timeslot = await TimeSlot.create({ day: 'Monday', slot: 1 });
        createdIds.timeslot = timeslot._id;

        console.log('Scheduling first class...');
        await Timetable.create({
            sectionId: section1._id,
            courseId: course1._id,
            facultyId: faculty._id,
            roomId: room._id,
            timeslotId: timeslot._id
        });

        console.log('Scheduling conflicting class (same Faculty, same Room, same Time)...');
        await Timetable.create({
            sectionId: section2._id,
            courseId: course2._id,
            facultyId: faculty._id, // Conflict source 1
            roomId: room._id,       // Conflict source 2
            timeslotId: timeslot._id
        });

        console.log('Running conflict detection...');
        const conflicts = await conflictService.detectConflicts();

        console.log('---------------------------------------------------');
        console.log(`Total Conflicts Found: ${conflicts.length}`);

        // Filter for our test conflicts
        const myConflicts = conflicts.filter(c =>
            (c.entityId.toString() === faculty._id.toString()) ||
            (c.entityId.toString() === room._id.toString())
        );

        console.log(`Conflicts related to test data: ${myConflicts.length}`);
        console.log(JSON.stringify(myConflicts, null, 2));
        console.log('---------------------------------------------------');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        console.log('Cleaning up test data...');
        if (createdIds.room) await Room.findByIdAndDelete(createdIds.room);
        if (createdIds.faculty) await Faculty.findByIdAndDelete(createdIds.faculty);
        if (createdIds.section1) await Section.findByIdAndDelete(createdIds.section1);
        if (createdIds.section2) await Section.findByIdAndDelete(createdIds.section2);
        if (createdIds.course1) await Course.findByIdAndDelete(createdIds.course1);
        if (createdIds.course2) await Course.findByIdAndDelete(createdIds.course2);
        if (createdIds.timeslot) await TimeSlot.findByIdAndDelete(createdIds.timeslot);

        // Clean up Timetable entries for this faculty
        if (createdIds.faculty) {
            await Timetable.deleteMany({ facultyId: createdIds.faculty });
        }

        console.log('Done.');
        await mongoose.disconnect();
    }
};

run();
