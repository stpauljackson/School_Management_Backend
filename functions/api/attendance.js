const admin = require('firebase-admin');

exports.saveAttendance = async (req, res) => {
    
  try {
    const attendanceData = req.body;
  
    const currentDate = new Date().toISOString().split('T')[0];

    const batch = admin.firestore().batch();
    
    attendanceData.forEach(({ uid, attendanceStatus }) => {
      const attendanceRef = admin.firestore().collection('Attendances').doc();
      batch.set(attendanceRef, {
        uid,
        attendanceStatus,
        date: currentDate
      });
    });

    await batch.commit();

    return res.status(200).send('Attendance saved successfully.');
  } catch (error) {
    console.error('Error saving attendance:', error);
    return res.status(500).send('Internal server error.');
  }
}
