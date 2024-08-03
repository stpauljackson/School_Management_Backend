const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Assuming you have already initialized Firebase Admin in your index.js
// admin.initializeApp();

exports.subject = async (req,res) => {

    const { schoolId, subjectNames } = req.body;

    if (!schoolId || !Array.isArray(subjectNames) || subjectNames.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'a valid schoolId and an array of subjectNames.');
    }

    const db = admin.firestore();
    const subjectsCollection = db.collection('Subjects');

    const batch = db.batch();
    subjectNames.forEach(subjectName => {
        const subjectId = uuidv4();
        const subjectRef = subjectsCollection.doc(subjectId);
        batch.set(subjectRef, {
            schoolId,
            subjectId,
            subjectName
        });
    });

    try {
        await batch.commit();
         return res.status(200).json({ success: true, message: 'Subjects added successfully.' });
    } catch (error) {
        console.error('Error adding subjects:', error);
        throw new functions.https.HttpsError('internal', 'Unable to add subjects, please try again later.');
    }
};
