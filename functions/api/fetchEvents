const admin = require('firebase-admin');

exports.fetchEvents = async (req, res) => {
    try {
        const { school } = req.body;
        if (!school) {
            return res.status(400).send('Bad Request: school required.');
        }

        const eventsRef = admin.firestore().collection('events');
        const querySnapshot = await eventsRef
        .where('school', '==', school)
        .get();

        const events = [];
        querySnapshot.forEach(doc => {
            events.push(doc.data());
        });

        return res.status(200).json(events);
    } catch (error) {
        console.error('Error in fetching events:', error);
        return res.status(500).send('Internal server error.');
    }
};
