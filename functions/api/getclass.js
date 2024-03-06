const admin = require('firebase-admin');

exports.getClass = async (req, res) => {
    try {
        const { uid} = req.body;
        const classes = admin.firestore().collection('classes');
        const querySnapshot = await usersRef
            .where('uid', '==', uid)
            .get();

        const users = [];
        querySnapshot.forEach(doc => {
            users.push(doc.data());
        });

        return res.status(200).json(users);

    } catch (error) {
        console.error('Error querying users:', error);
        return res.status(500).send('Internal server error.');
    }
};
