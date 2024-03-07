const admin = require("firebase-admin");

exports.getAllStudentsfromClass = async (req, res) => {
	try {
		const { Type, School, Class, Section } = req.body;
        if(!Class || !Section || !Type || !School)
        {
            return res.status(400).send('Missing required fields');
        }
		const usersRef = admin.firestore().collection("users");
		const querySnapshot = await usersRef
			.where("type", "==", Type)
			.where("school", "==", School)
			.where("class", "==", Class)
			.where("section", "==", Section)
			.get();

		const users = [];
		querySnapshot.forEach((doc) => {
			const userData = doc.data();
            const uid = doc.id;
            users.push({ ...userData, uid });
		});

        return res.status(200).json(users);
	} catch (error) {
		console.error("Error querying users:", error);
		return res.status(500).send("Internal server error.");
	}
};
