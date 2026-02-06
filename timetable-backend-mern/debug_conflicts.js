const mongoose = require('mongoose');
require('dotenv').config();
const Conflict = require('./models/Conflict');
const TimeSlot = require('./models/TimeSlot');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timetable-db');
        console.log('Connected to DB');

        const conflicts = await Conflict.find().populate('timeslotId');
        console.log(`Found ${conflicts.length} conflicts`);

        if (conflicts.length > 0) {
            console.log('Sample Conflict:');
            console.log(JSON.stringify(conflicts[0], null, 2));
        }

        const timeslots = await TimeSlot.find().limit(5);
        console.log(`Found ${timeslots.length} timeslots (showing 5):`);
        console.log(JSON.stringify(timeslots, null, 2));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
