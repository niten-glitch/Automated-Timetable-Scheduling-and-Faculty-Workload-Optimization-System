const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json({
            message: 'Courses retrieved successfully',
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving courses',
            error: error.message,
        });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({
            message: 'Course retrieved successfully',
            data: course,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving course',
            error: error.message,
        });
    }
});

// Create course
router.post('/', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({
            message: 'Course created successfully',
            data: course,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating course',
            error: error.message,
        });
    }
});

// Update course
router.put('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({
            message: 'Course updated successfully',
            data: course,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating course',
            error: error.message,
        });
    }
});

// Delete course
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting course',
            error: error.message,
        });
    }
});

module.exports = router;
