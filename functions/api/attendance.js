const admin = require('firebase-admin');

exports.saveAttendance = async (req, res) => {
    
  try {
    const {attendanceData,teacherID} = req.body;
    const currentDate = new Date().toISOString().split('T')[0];

    const batch = admin.firestore().batch();
    
    attendanceData.forEach(({ participantId, attendanceStatus }) => {
      const attendanceRef = admin.firestore().collection('Attendances').doc();
      batch.set(attendanceRef, {
        participantId,
        attendanceStatus,
        date: currentDate,
        teacherID
      });
    });

    await batch.commit();

    return res.status(200).send('Attendance Saved');
  } catch (error) {
    console.error('Error saving attendance:', error);
    return res.status(500).send('Internal server error.');
  }
}
