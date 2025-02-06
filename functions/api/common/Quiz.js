const admin = require('firebase-admin');

exports.createNewQuiz = async (req, res) => {
    try {
        const { quizName, classId, subject, teacherId, time, questions, date } = req.body;

        if (!quizName || !classId || !subject || !teacherId || !time || !questions || !date) {
            return res.status(400).send('Bad Request: quizName, classId and questions are required.');
        }

        const quizzesRef = admin.firestore().collection('Quizzes');
        const newQuizRef = await quizzesRef.add({
            quizName,
            classId,
            subjectId: subject,
            teacherId,
            time,
            questions,
            studentAttempts:[],
            date
        });
        return res.status(201).json(`Quiz created successfully. Document ID: ${newQuizRef.id}`);
    } catch (error) {
        console.error('Error creating a new quiz:', error);
        return res.status(500).send('Internal server error.');
    }
};

exports.updateQuizStudentAttempts = async (req, res) => {
    try {
        const { quizId, userId, selectedOptions, name,correctAnswers,percentage } = req.body;

        if (!quizId || !userId || !selectedOptions || !name,!correctAnswers || !percentage) {
            return res.status(400).send('Bad Request: quizId, userId, marks and name are required.');
        }

        const quizzesRef = admin.firestore().collection('Quizzes');
        const quizRef = quizzesRef.doc(quizId);
        const quizDoc = await quizRef.get();
        const studentAttempts = quizDoc.data().studentAttempts || [];
        studentAttempts.push({ userId, selectedOptions, name ,correctAnswers,percentage });
        await quizRef.update({
            studentAttempts
        });
        return res.status(200).json(`Quiz student attempts updated successfully. Document ID: ${quizId}`);
    } catch (error) {
        console.error('Error updating quiz student attempts:', error);
        return res.status(500).send('Internal server error.');
    }
};

exports.getQuizzesByClassTeacherSubject = async (req, res) => {
    try {
        const { classId, teacherId, subject, type } = req.body;

        if (!classId || !type) {
            return res.status(400).send('Bad Request: classId and type are required.');
        }

        const quizzesRef = admin.firestore().collection('Quizzes');
        let query = quizzesRef;

        if (type === 'teacher') {
            query = query.where('classId', '==', classId)
                .where('teacherId', '==', teacherId)
                .where('subjectId', '==', subject);
        } else if (type === 'student') {
            query = query.where('classId', '==', classId);
        } else {
            return res.status(400).send('Bad Request: Invalid type.');
        }

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return res.status(200).send([]);
        }

        const quizzes = [];
        querySnapshot.forEach(doc => {
            quizzes.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error retrieving quizzes:', error);
        return res.status(500).send('Internal server error.');
    }
};

