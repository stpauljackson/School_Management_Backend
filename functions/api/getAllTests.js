
const admin = require('firebase-admin');

// Fetch all tests
exports.getAllTests = async (req, res) => {
    try {

        const { teacherId, classId } = req.body;

        if (!teacherId || !classId) {
            return res.status(400).send('Bad Request: teacherId and classId are required.');
        }

        const testsRef = admin.firestore().collection('tests');
        const querySnapshot = await testsRef.
        where('teacherId','==',teacherId)
        .where('classId','==',classId)
        .get();

        const tests = [];
        querySnapshot.forEach(doc => {
            tests.push(doc.data());
        });

        return res.status(200).json(tests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        return res.status(500).send('Internal server error.');
    }
};

// Create a new test
exports.createNewTest = async (req, res) => {
    try {
        const { teacherId, classId, testName, subject, date } = req.body;

        if (!testName || !subject || !date || !teacherId || !classId) {
            return res.status(400).send('Bad Request: testName and questions are required.');
        }

        const testsRef = admin.firestore().collection('tests');
        const newTestRef = await testsRef.add({
            teacherId,
            classId,
            testName,
            subject,
            date,
        });
        return res.status(201).json('test created successfully');
    } catch (error) {
        console.error('Error creating a new test:', error);
        return res.status(500).send('Internal server error.');
    }
};
