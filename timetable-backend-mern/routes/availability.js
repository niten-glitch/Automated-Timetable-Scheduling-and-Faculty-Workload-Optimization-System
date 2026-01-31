const express = require('express');
const router = express.Router();
const FacultyAvailability = require('../models/FacultyAvailability');

// Get all availability records
router.get('/', async (req, res) => {
    try {
        const availability = await FacultyAvailability.find()
            .populate('facultyId')
            .populate('timeslotId');
        res.json({
            message: 'Availability records retrieved successfully',
            count: availability.length,
            data: availability,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving availability records',
            error: error.message,
        });
    }
});

// Get availability by faculty
router.get('/faculty/:facultyId', async (req, res) => {
    try {
        const availability = await FacultyAvailability.find({
            facultyId: req.params.facultyId
        }).populate('timeslotId');
        res.json({
            message: 'Faculty availability retrieved successfully',
            count: availability.length,
            data: availability,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving faculty availability',
            error: error.message,
        });
    }
});

// Get single availability record
router.get('/:id', async (req, res) => {
    try {
        const availability = await FacultyAvailability.findById(req.params.id)
            .populate('facultyId')
            .populate('timeslotId');
        if (!availability) {
            return res.status(404).json({ message: 'Availability record not found' });
        }
        res.json({
            message: 'Availability record retrieved successfully',
            data: availability,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving availability record',
            error: error.message,
        });
    }
});

// Create availability record
router.post('/', async (req, res) => {
    try {
        const availability = new FacultyAvailability(req.body);
        await availability.save();
        res.status(201).json({
            message: 'Availability record created successfully',
            data: availability,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating availability record',
            error: error.message,
        });
    }
});

// Update availability record
router.put('/:id', async (req, res) => {
    try {
        const availability = await FacultyAvailability.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!availability) {
            return res.status(404).json({ message: 'Availability record not found' });
        }
        res.json({
            message: 'Availability record updated successfully',
            data: availability,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating availability record',
            error: error.message,
        });
    }
});

// Delete availability record
router.delete('/:id', async (req, res) => {
    try {
        const availability = await FacultyAvailability.findByIdAndDelete(req.params.id);
        if (!availability) {
            return res.status(404).json({ message: 'Availability record not found' });
        }
        res.json({ message: 'Availability record deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting availability record',
            error: error.message,
        });
    }
});

module.exports = router;
