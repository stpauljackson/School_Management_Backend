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
            events.push({id: doc.id, ...doc.data()});
        });

        return res.status(200).json(events);
    } catch (error) {
        console.error('Error in fetching events:', error);
        return res.status(500).send('Internal server error.');
    }
};
exports.deleteEventById = async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).send('Bad Request: eventId required.');
        }

        const eventRef = admin.firestore().collection('events').doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return res.status(404).send('Event not found.');
        }
        await eventRef.delete();
        return res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(500).send('Internal server error.');
    }
};
