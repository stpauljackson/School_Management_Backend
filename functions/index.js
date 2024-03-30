const functions = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");

const { saveAttendance } = require("./api/attendance");
const { getAllStudentsfromClass, getCalendar } = require("./api/teacher");
const { saveMarks } = require("./api/savemarks");
const { getClass } = require("./api/getclass");
const { getAllTests, createNewTest } = require("./api/getAllTests");
const { fetchEvents } = require("./api/fetchEvents");
const { deleteRecordsByDate } = require("./api/delete_records");
const { uploadFile, getAssignments } = require("./api/assignments.js");
const {sendNotification} = require("./api/notification.js");

exports.saveAttendance = functions.https.onRequest(saveAttendance);
exports.saveMarks = functions.https.onRequest(saveMarks);
exports.getAllStudentsfromClass = functions.https.onRequest(
	getAllStudentsfromClass
);
exports.getClass = functions.https.onRequest(getClass);
exports.getAllTests = functions.https.onRequest(getAllTests);
exports.createNewTest = functions.https.onRequest(createNewTest);
exports.fetchEvents = functions.https.onRequest(fetchEvents);
exports.getCalendar = functions.https.onRequest(getCalendar);
exports.uploadFile = functions.https.onRequest(uploadFile);
exports.deleteRecordsByDate = functions.https.onRequest(deleteRecordsByDate);
exports.getAssignments = functions.https.onRequest(getAssignments);
exports.sendNotification = functions.https.onRequest((req, res) => {
	const title = "Notification Title";
	const body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

	const deviceTokens = ["de3nC-uPQfu4RQAexCXLnK:APA91bHwN6rhmh1VtMAwTaQt2ffRHsUjwqUmiHJGtuHIfoniNml80mKrG8rjLApoGKkX5ZUzPWA4rxOu1pKdqfLDK-ST69KEUdb389IFerBi42Do1dJfCQAEuAxxUwaZeBtm00fo7mhu"]
	sendNotification(title, body, deviceTokens)
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});
	return res.status(200).send("Notification sent successfully");
});
initializeApp();
