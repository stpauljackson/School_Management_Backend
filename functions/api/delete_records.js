const admin = require('firebase-admin');

exports.deleteRecordsByDate = async (req, res) => {
    try {
        const { date } = req.body;

        // Assuming dateFilter is a timestamp or date string in ISO format
        const classRef = admin.firestore().collection('classes');
        const querySnapshot = await classRef
            .where('dateField', '==', new Date(date))
            .get();

        const batch = admin.firestore().batch();

        querySnapshot.forEach(doc => {
            const docRef = classRef.doc(doc.id);
            batch.delete(docRef);
        });

        await batch.commit();

        return res.status(200).json({ message: 'Records deleted successfully.' });

    } catch (error) {
        console.error('Error deleting records:', error);
        return res.status(500).send('Internal server error.');
    }
};
