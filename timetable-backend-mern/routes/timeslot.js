const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');

// Get all timeslots
router.get('/', async (req, res) => {
    try {
        const timeslots = await TimeSlot.find();
        res.json({
            message: 'Timeslots retrieved successfully',
            count: timeslots.length,
            data: timeslots,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving timeslots',
            error: error.message,
        });
    }
});

// Get single timeslot
router.get('/:id', async (req, res) => {
    try {
        const timeslot = await TimeSlot.findById(req.params.id);
        if (!timeslot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }
        res.json({
            message: 'Timeslot retrieved successfully',
            data: timeslot,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving timeslot',
            error: error.message,
        });
    }
});

// Create timeslot
router.post('/', async (req, res) => {
    try {
        const timeslot = new TimeSlot(req.body);
        await timeslot.save();
        res.status(201).json({
            message: 'Timeslot created successfully',
            data: timeslot,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating timeslot',
            error: error.message,
        });
    }
});

// Update timeslot
router.put('/:id', async (req, res) => {
    try {
        const timeslot = await TimeSlot.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!timeslot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }
        res.json({
            message: 'Timeslot updated successfully',
            data: timeslot,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating timeslot',
            error: error.message,
        });
    }
});

// Delete timeslot
router.delete('/:id', async (req, res) => {
    try {
        const timeslot = await TimeSlot.findByIdAndDelete(req.params.id);
        if (!timeslot) {
            return res.status(404).json({ message: 'Timeslot not found' });
        }
        res.json({ message: 'Timeslot deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting timeslot',
            error: error.message,
        });
    }
});

module.exports = router;
