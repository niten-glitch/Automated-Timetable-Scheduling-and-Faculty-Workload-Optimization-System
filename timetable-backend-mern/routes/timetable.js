const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Room = require('../models/Room');
const TimeSlot = require('../models/TimeSlot');
const Timetable = require('../models/Timetable');
const { generateTimetable } = require('../services/timetableGenerator');
const { detectConflicts } = require('../services/conflictDetector');

// Generate timetable
router.post('/generate', async (req, res) => {
    try {
        // Get all data
        const sections = await Section.find();
        const courses = await Course.find();
        const faculties = await Faculty.find();
        const rooms = await Room.find();
        const timeslots = await TimeSlot.find();

        // Create section_courses mapping
        const sectionCourses = {};
        for (const section of sections) {
            sectionCourses[section._id.toString()] = courses;
        }

        const result = await generateTimetable(
            sections,
            sectionCourses,
            faculties,
            rooms,
            timeslots
        );

        res.json({
            message: 'Timetable generated successfully',
            entries: result.length,
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error generating timetable',
            error: error.message,
        });
    }
});

// Get all timetable entries
router.get('/', async (req, res) => {
    try {
        const timetable = await Timetable.find()
            .populate('sectionId')
            .populate('courseId')
            .populate('facultyId')
            .populate('roomId')
            .populate('timeslotId');

        res.json({
            message: 'Timetable retrieved successfully',
            count: timetable.length,
            data: timetable,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving timetable',
            error: error.message,
        });
    }
});

// Get specific timetable entry
router.get('/:id', async (req, res) => {
    try {
        const entry = await Timetable.findById(req.params.id)
            .populate('sectionId')
            .populate('courseId')
            .populate('facultyId')
            .populate('roomId')
            .populate('timeslotId');

        if (!entry) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }

        res.json({
            message: 'Timetable entry retrieved successfully',
            data: entry,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving timetable entry',
            error: error.message,
        });
    }
});

// Delete all timetable entries
router.delete('/', async (req, res) => {
    try {
        await Timetable.deleteMany({});
        res.json({ message: 'All timetable entries deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting timetable entries',
            error: error.message,
        });
    }
});

// Detect conflicts
router.get('/conflicts/detect', async (req, res) => {
    try {
        const conflicts = await detectConflicts();
        res.json({
            message: 'Conflict detection completed',
            count: conflicts.length,
            data: conflicts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error detecting conflicts',
            error: error.message,
        });
    }
});

module.exports = router;
