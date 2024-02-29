const admin = require('firebase-admin');

exports.saveMarks = async (req, res) => {
  try {
    const marksData = req.body;

    const currentDate = new Date().toISOString().split('T')[0];

    const batch = admin.firestore().batch();

    marksData.forEach(({ uid, subject, marks }) => {
      const marksRef = admin.firestore().collection('Marks').doc();
      batch.set(marksRef, {
        uid,
        subject,
        marks,
        date: currentDate
      });
    });

    await batch.commit();

    return res.status(200).send('Marks saved successfully.');
  } catch (error) {
    console.error('Error saving marks:', error);
    return res.status(500).send('Internal server error.');
  }
};
