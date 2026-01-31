const express = require('express');
const router = express.Router();
const Section = require('../models/Section');

// Get all sections
router.get('/', async (req, res) => {
    try {
        const sections = await Section.find();
        res.json({
            message: 'Sections retrieved successfully',
            count: sections.length,
            data: sections,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving sections',
            error: error.message,
        });
    }
});

// Get single section
router.get('/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json({
            message: 'Section retrieved successfully',
            data: section,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving section',
            error: error.message,
        });
    }
});

// Create section
router.post('/', async (req, res) => {
    try {
        const section = new Section(req.body);
        await section.save();
        res.status(201).json({
            message: 'Section created successfully',
            data: section,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating section',
            error: error.message,
        });
    }
});

// Update section
router.put('/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json({
            message: 'Section updated successfully',
            data: section,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating section',
            error: error.message,
        });
    }
});

// Delete section
router.delete('/:id', async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting section',
            error: error.message,
        });
    }
});

module.exports = router;
