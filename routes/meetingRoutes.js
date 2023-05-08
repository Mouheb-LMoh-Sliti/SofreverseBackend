const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware.js');
const Meeting = require('../model/Meeting');

// POST /create - create a new meeting
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { label, startTime } = req.body;
    const owner = req.user._id;
    const participants = [owner]; // Add the owner as a participant

    const meeting = new Meeting({
      label,
      startTime,
      owner,
      participants
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Failed to create a new meeting.' });
  }
});

// PUT /meet/:id - edit an existing meeting
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { label, startTime, participants } = req.body;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    if (meeting.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized. You are not the owner of this meeting.' });
    }

    meeting.label = label;
    meeting.startTime = startTime;
    //meeting.location = location;
    meeting.participants = participants;

    await meeting.save();
    res.json(meeting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Failed to update the meeting.' });
  }
});

// DELETE /meet/:id - delete an existing meeting
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    if (meeting.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized. You are not the owner of this meeting.' });
    }

    await meeting.deleteOne();
    res.json({ message: 'Meeting deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Failed to delete the meeting.' });
  }
});

// GET  - get all meetings in which a user is a participant
router.get('/', authMiddleware, async (req, res) => {
  try {
    const meetings = await Meeting.find({ participants: req.user._id });
    res.json(meetings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error. Failed to retrieve meetings.' });
  }
});


module.exports = router;
