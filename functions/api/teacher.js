const admin = require("firebase-admin");

exports.getAllStudentsfromClass = async (req, res) => {
    try {
        const { Purpose, Type, School, Class, Section } = req.body;

        
        if (!Purpose || !Class || !Section || !Type || !School) {
            return res.status(400).send('Missing required fields');
        }
        const currentDate = new Date().toISOString().split('T')[0];

        if(Purpose = "Attendance"){ 
            // Check if attendance is already marked for today
            const todayAttendanceRef = admin.firestore().collection('Attendances')
                .where('date', '==', currentDate)
                .limit(1);

            const todayAttendanceSnapshot = await todayAttendanceRef.get();

            if (!todayAttendanceSnapshot.empty) {
                return res.status(200).send('Attendance is already marked for today');
            }

            // If attendance is not marked for today, fetch the list of students
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
        }
        else if(Purpose = "Upload Marks"){
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
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error querying users:", error);
        return res.status(500).send("Internal server error.");
    }
};