const express = require('express');
const router = express.Router();
const conflictService = require('./service');

// Get all conflicts
router.get('/', async (req, res) => {
    try {
        const { proposalId } = req.query;
        const conflicts = await conflictService.getConflicts(proposalId);
        res.json({
            success: true,
            count: conflicts.length,
            data: conflicts
        });
    } catch (error) {
        console.error('Error fetching conflicts:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// Trigger conflict detection manually
router.post('/detect', async (req, res) => {
    try {
        const proposalId = (req.body && req.body.proposalId) || (req.query && req.query.proposalId);
        const conflicts = await conflictService.detectConflicts(proposalId);
        res.json({
            success: true,
            message: 'Conflict detection run successfully',
            conflictsFound: conflicts.length,
            data: conflicts
        });
    } catch (error) {
        console.error('Error detecting conflicts:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

module.exports = router;
