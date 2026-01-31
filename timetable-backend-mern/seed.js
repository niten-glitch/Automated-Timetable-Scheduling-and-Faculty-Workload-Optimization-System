require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');

const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Room = require('./models/Room');
const Section = require('./models/Section');
const TimeSlot = require('./models/TimeSlot');
const FacultyAvailability = require('./models/FacultyAvailability');

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Faculty.deleteMany({});
        await Course.deleteMany({});
        await Room.deleteMany({});
        await Section.deleteMany({});
        await TimeSlot.deleteMany({});
        await FacultyAvailability.deleteMany({});

        console.log('Cleared existing data');

        // Create Faculties
        const faculties = await Faculty.insertMany([
            { name: 'Dr. John Smith', maxLoad: 18 },
            { name: 'Dr. Sarah Johnson', maxLoad: 18 },
            { name: 'Dr. Michael Brown', maxLoad: 15 },
        ]);
        console.log(`Created ${faculties.length} faculties`);

        // Create Courses
        const courses = await Course.insertMany([
            { name: 'Data Structures', courseType: 'theory', hoursPerWeek: 3 },
            { name: 'Database Systems', courseType: 'theory', hoursPerWeek: 3 },
            { name: 'Computer Networks', courseType: 'theory', hoursPerWeek: 3 },
            { name: 'DS Lab', courseType: 'lab', hoursPerWeek: 2 },
            { name: 'DBMS Lab', courseType: 'lab', hoursPerWeek: 2 },
        ]);
        console.log(`Created ${courses.length} courses`);

        // Create Rooms
        const rooms = await Room.insertMany([
            { capacity: 60, roomType: 'theory' },
            { capacity: 60, roomType: 'theory' },
            { capacity: 30, roomType: 'lab' },
            { capacity: 30, roomType: 'lab' },
        ]);
        console.log(`Created ${rooms.length} rooms`);

        // Create Sections
        const sections = await Section.insertMany([
            { name: 'CS-A', studentCount: 50 },
            { name: 'CS-B', studentCount: 45 },
        ]);
        console.log(`Created ${sections.length} sections`);

        // Create TimeSlots (5 days, 6 slots per day)
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const timeslots = [];
        for (const day of days) {
            for (let slot = 1; slot <= 6; slot++) {
                timeslots.push({ day, slot });
            }
        }
        const createdTimeslots = await TimeSlot.insertMany(timeslots);
        console.log(`Created ${createdTimeslots.length} timeslots`);

        // Create Faculty Availability (all faculties available for all slots by default)
        const availabilityRecords = [];
        for (const faculty of faculties) {
            for (const timeslot of createdTimeslots) {
                availabilityRecords.push({
                    facultyId: faculty._id,
                    timeslotId: timeslot._id,
                    isAvailable: true,
                });
            }
        }
        await FacultyAvailability.insertMany(availabilityRecords);
        console.log(`Created ${availabilityRecords.length} availability records`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
