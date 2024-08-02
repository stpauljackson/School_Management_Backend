const admin = require('firebase-admin');

exports.createNewExam =  async (req, res) => {
    try {
        const examData  = req.body;
        const db = admin.firestore();
        const examRef = db.collection('examinations').doc();
        await examRef.set({
            subject: examData.subject,
            classId: examData.classId,
            date: examData.date,
            type: examData.type
        });
        res.send('Exam created successfully');
    } catch (error) {
        res.send('Error creating exam:');
        console.log(error)
    }
};

exports.getExamsByClassId = async (req, res) => {
    try {
        const { classId } = req.body;
        if (!classId) {
            return res.status(400).send('Bad Request: classId is required.');
        }

        const examsRef = admin.firestore().collection('exams');
        const querySnapshot = await examsRef.where('classId', '==', classId).where('date', '>=', new Date()).get();

        const exams = [];
        querySnapshot.forEach(doc => {
            const examData = doc.data();
            if (examData.date >= new Date()) {
                exams.push({id: doc.id, ...examData});
            }
        });

        return res.status(200).json(exams);
    } catch (error) {
        console.error('Error getting exams by classId:', error);
        return res.status(500).send('Internal server error.');
    }
};
