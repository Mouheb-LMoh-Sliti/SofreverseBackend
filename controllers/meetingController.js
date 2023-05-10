const Meeting = require('../model/Meeting');
const Account = require('../model/Account');

exports.createMeeting= async (req, res) => {
    const { label, startTime, owner, participantUsernames } = req.body;
    if (!Array.isArray(participantUsernames)) {
      return res.status(400).json({ error: 'participantUsernames must be an array' });
    }
    
    try {
      const participants = await Account.find({ username: { $in: participantUsernames } });
      const participantIds = participants.map(participant => participant._id);
  
      const meeting = await Meeting.create({
        label,
        startTime,
        owner,
        participants: participantIds,
      });
      res.status(201).json(meeting);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  }


exports.editMeeting = async (req, res) => {
  const { id } = req.params;
  const { label, startTime, participantUsernames } = req.body;

  try {
    const meeting = await Meeting.findOne({ _id: id, owner: req.user.id });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    // Find participants by their usernames
    const participants = await Account.find({ username: { $in: participantUsernames } });

    // Update participants of the meeting
    meeting.participants = participants.map(participant => participant._id);

    // Update other fields of the meeting
    meeting.label = label;
    meeting.startTime = startTime;

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
    const meetings = await Meeting.aggregate([
      {
        $match: { participants: userId, startTime: { $gt: new Date() } },
      },
      {
        $group: { _id: "$_id", meeting: { $first: "$$ROOT" } },
      },
      {
        $replaceRoot: { newRoot: "$meeting" },
      },
    ]);

    res.json({ meetings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
}
