const admin = require("firebase-admin");
const moment = require("moment-timezone");

exports.getCalendar = async (req, res) => {
	const { School } = req.body;
	const calendarRef = admin.firestore().collection("calender");
	const querySnapshot = await calendarRef.where("schoolId", "==", School).get();
	const holidays = [];
	querySnapshot.forEach((doc) => {
		holidays.push(doc.data());
	});
    return res.status(200).json(holidays);
};
exports.getAllStudentsfromClass = async (req, res) => {
	try {
		const { Type, School, Class, purpose, teacherID } = req.body;
		if (!Class || !Type || !purpose) {
			return res.status(400).send("Missing required fields");
		}

		const currentDate = moment().tz("Asia/Kolkata");
		const dayOfWeek = currentDate.day();

		if (purpose === "attendance") {
            if (!teacherID || !School) {
                return res.status(400).send("Missing required fields");
            }
            const todayAttendanceRef = admin.firestore().collection('Attendances')
                .where('date', '==', currentDate.format("YYYY-MM-DD"))
                .where('teacherID', '==', teacherID)
                .limit(1);

            const todayAttendanceSnapshot = await todayAttendanceRef.get();
            console.log('marked or not' , currentDate.format("YYYY-MM-DD"),teacherID)
            if (!todayAttendanceSnapshot.empty) {
                let response = { errorMessage:'Attendance is already marked for today'}
                return res.status(200).json(response);
            }

			const isSunday = dayOfWeek === 0;
			const isHoliday = await checkHoliday(currentDate, School);
			console.log(isSunday, isHoliday);
			if (isSunday || isHoliday) {
                let response = {errorMessage:"Today is a Non working day/Holiday"}
				return res.status(200).json(response);
			}
		}
        
		const usersRef = admin.firestore().collection("users");
		const querySnapshot = await usersRef
			.where("type", "==", Type)
			.where("classId", "==", Class)
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

async function checkHoliday(date, school) {
	try {
		const calendarRef = admin.firestore().collection("calendar");
		const holidayQuerySnapshot = await calendarRef
			.where("date", "==", date.format("YYYY-MM-DD"))
			.where("school", "==", school)
			.limit(1)
			.get();
		console.log("date", date.format("YYYY-MM-DD"));
		return !holidayQuerySnapshot.empty;
	} catch (error) {
		console.error("Error checking holiday:", error);

		return false;
	}
}
