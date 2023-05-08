const Meeting = require('../model/Meeting');
const Account = require('../model/Account');

exports.createMeeting = async (req, res) => {
  const { label, startTime, location } = req.body;
  const owner = req.user.id;

  try {
    const meeting = await Meeting.create({
      label,
      startTime,
      owner,
      location,
    });

    res.status(201).json({ meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.editMeeting = async (req, res) => {
  const { id } = req.params;
  const { label, startTime, location, participantUsernames } = req.body;

  try {
    const meeting = await Meeting.findOne({ _id: id, owner: req.user.id });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    // Find participants by their usernames
    const participants = await Account.find({ username: { $in: participantUsernames } });

    // Add participants' usernames to the meeting
    meeting.participants = participants.map(participant => participant.username);

    // Update other fields of the meeting
    meeting.label = label;
    meeting.startTime = startTime;
    meeting.location = location;

    await meeting.save();

    res.json({ meeting });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.deleteMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await Meeting.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    res.json({ message: 'Meeting deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getParticipantMeetings = async (req, res) => {
  const userId = req.user.id;

  try {
    const meetings = await Meeting.find({
      startTime: { $gt: Date.now() }, // Only get upcoming meetings
      participants: userId,
    });

    res.json({ meetings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }}