const mongoose = require('mongoose');
require('dotenv').config();
const Conflict = require('./models/Conflict');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const result = await Conflict.deleteMany({});
        console.log(`Deleted ${result.deletedCount} stale conflicts.`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
