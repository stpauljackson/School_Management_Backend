const admin = require("firebase-admin");

exports.addHoliday = async (req, res) => {

    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { schoolId, date, day } = req.body;


    if (!schoolId || !date || !day) {
        return res.status(400).send('Bad Request: Missing required fields');
    }

    try {

        const newEntry = {
            schoolId,
            date,
            day
        };
        const docRef = await admin.firestore().collection('calender').add(newEntry);
        
        res.status(201).send(`Calendar entry added with ID: ${docRef.id}`);
    } catch (error) {
        console.error('Error adding calendar entry:', error);
        res.status(500).send('Internal Server Error');
    }
}
