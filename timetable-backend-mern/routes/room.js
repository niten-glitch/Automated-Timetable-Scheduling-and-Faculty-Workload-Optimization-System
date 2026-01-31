const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json({
            message: 'Rooms retrieved successfully',
            count: rooms.length,
            data: rooms,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving rooms',
            error: error.message,
        });
    }
});

// Get single room
router.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({
            message: 'Room retrieved successfully',
            data: room,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving room',
            error: error.message,
        });
    }
});

// Create room
router.post('/', async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json({
            message: 'Room created successfully',
            data: room,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating room',
            error: error.message,
        });
    }
});

// Update room
router.put('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({
            message: 'Room updated successfully',
            data: room,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating room',
            error: error.message,
        });
    }
});

// Delete room
router.delete('/:id', async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting room',
            error: error.message,
        });
    }
});

module.exports = router;
