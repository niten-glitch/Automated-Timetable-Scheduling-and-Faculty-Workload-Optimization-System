require('dotenv').config();
const mongoose = require('mongoose');
const Timetable = require('./models/Timetable');
const Room = require('./models/Room');
const Faculty = require('./models/Faculty');
const Section = require('./models/Section');
const Course = require('./models/Course');
const TimeSlot = require('./models/TimeSlot');

const createConflictingEntries = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get existing data
        const faculty = await Faculty.findOne();
        const room = await Room.findOne();
        const section1 = await Section.findOne();
        const section2 = await Section.find().skip(1).limit(1);
        const course1 = await Course.findOne();
        const course2 = await Course.find().skip(1).limit(1);
        const timeslot = await TimeSlot.findOne();

        if (!faculty || !room || !section1 || !course1 || !timeslot) {
            console.log('❌ Missing required data. Please run seed first: npm run seed');
            process.exit(1);
        }

        console.log('📋 Using existing data:');
        console.log(`   Faculty: ${faculty.name}`);
        console.log(`   Room: ${room.roomType} (Capacity: ${room.capacity})`);
        console.log(`   Timeslot: ${timeslot.day}, Slot ${timeslot.slot}\n`);

        // Create first entry
        const entry1 = await Timetable.create({
            sectionId: section1._id,
            courseId: course1._id,
            facultyId: faculty._id,
            roomId: room._id,
            timeslotId: timeslot._id
        });
        console.log('✅ Created Entry 1:', {
            section: section1.name,
            course: course1.name,
            faculty: faculty.name,
            room: room.roomType,
            time: `${timeslot.day}, Slot ${timeslot.slot}`
        });

        // Create CONFLICTING entry (same faculty, same room, same time)
        const section2Doc = section2[0] || section1;
        const course2Doc = course2[0] || course1;

        const entry2 = await Timetable.create({
            sectionId: section2Doc._id,
            courseId: course2Doc._id,
            facultyId: faculty._id,  // ⚠️ CONFLICT: Same faculty
            roomId: room._id,        // ⚠️ CONFLICT: Same room
            timeslotId: timeslot._id // ⚠️ CONFLICT: Same timeslot
        });
        console.log('✅ Created Entry 2 (CONFLICTING):', {
            section: section2Doc.name,
            course: course2Doc.name,
            faculty: faculty.name,
            room: room.roomType,
            time: `${timeslot.day}, Slot ${timeslot.slot}`
        });

        console.log('\n🔥 CONFLICTS CREATED!');
        console.log('Expected conflicts:');
        console.log('   1. Faculty Conflict - Same faculty teaching two classes');
        console.log('   2. Room Conflict - Same room hosting two classes');
        if (section1._id.toString() === section2Doc._id.toString()) {
            console.log('   3. Section Conflict - Same section having two classes');
        }

        console.log('\n📝 Test IDs (for cleanup):');
        console.log(`   Entry 1: ${entry1._id}`);
        console.log(`   Entry 2: ${entry2._id}`);

        console.log('\n✨ Now test the conflict detection:');
        console.log('   1. Open the frontend');
        console.log('   2. Click "🔍 Detect Conflicts"');
        console.log('   3. Click "⚠️ View Conflicts"');
        console.log('   4. You should see the conflicts listed!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
};

createConflictingEntries();
