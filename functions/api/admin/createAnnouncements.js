const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createAnnouncements = async (req, res) => {
  const { message, school, title } = req.body;
  const currentDate = new Date().toISOString();

  const announcement = {
    message,
    school,
    title,
    currentDate,
  };

  const db = admin.firestore();
  db.collection('events').add(announcement)
    .then((doc) => {
      return doc.get()
    })
    .then(announcementCreated => res.send(announcementCreated.data()))
    .catch((error) => {
      console.error('Error creating announcement:', error);
      res.status(500).send('Internal server error');
    });
};

