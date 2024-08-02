const admin = require('firebase-admin');
const functions = require("firebase-functions");

exports.student_exam = async (req, res) => {
    const {classId} = req.body;
    const currentDate = new Date();
    const db = admin.firestore();
    if (!classId) {
        return res.status(400).send('Class ID is required');
    }

    try {
        const examinationsRef = db.collection('examinations');
        const snapshot = await examinationsRef.where('classId', '==', classId)
                                               .get();

        if (snapshot.empty) {
            return res.status(404).send('No upcoming examinations found');
        }

        let examinations = [];
        snapshot.forEach(doc => {
            let exam = doc.data();
            exam.id = doc.id;
            examinations.push(exam);
        });

        return res.status(200).json(examinations);
    } catch (error) {
        console.error('Error fetching examinations:', error);
        return res.status(500).send('Internal Server Error');
    }
};