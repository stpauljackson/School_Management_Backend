const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createAnnouncement = functions.firestore
  .document('announcement_staging/{documentId}')
  .onCreate(async (snap, context) => {
    const newValue = snap.data();

    if (!newValue.title || !newValue.body || !newValue.schoolId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Title, body and schoolId are required.'
      );
    }

    const currentDate = new Date().toISOString();

    const batch = admin.firestore().batch();
    const announcementsRef = admin.firestore().collection('events');
    const announcementDocRef = announcementsRef.doc();

    batch.set(announcementDocRef, {
      title: newValue.title,
      body: newValue.body,
      schoolId: newValue.schoolId,
      date: currentDate,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    batch.delete(snap.ref);

    await batch.commit();

    return { message: 'Announcement created successfully.' };
  });

