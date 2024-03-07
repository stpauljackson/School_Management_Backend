const admin = require('firebase-admin');

exports.getClass = async (req, res) => {
    try {
        const { uid } = req.body;
        const classRef = admin.firestore().collection('classes');
        const querySnapshot = await classRef
            .where('teacherId', '==', uid)
            .get();

        const classes = [];
        querySnapshot.forEach(doc => {
            const Class = doc.data();
            const docID = doc.id;
            classes.push({ ...Class, docID });
        });

        return res.status(200).json(classes);

    } catch (error) {
        console.error('Error querying users:', error);
        return res.status(500).send('Internal server error.');
    }
};
