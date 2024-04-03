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
const {createUserIdsWithExcelFile,createClasses} = require("./api/admin.js");

exports.saveAttendance = functions.https.onRequest(saveAttendance);
exports.saveMarks = functions.https.onRequest(saveMarks);
exports.getAllStudentsfromClass = functions.https.onRequest(getAllStudentsfromClass);
exports.getClass = functions.https.onRequest(getClass);
exports.getAllTests = functions.https.onRequest(getAllTests);
exports.createNewTest = functions.https.onRequest(createNewTest);
exports.fetchEvents = functions.https.onRequest(fetchEvents);
exports.getCalendar = functions.https.onRequest(getCalendar);
exports.uploadFile = functions.https.onRequest(uploadFile);
exports.deleteRecordsByDate = functions.https.onRequest(deleteRecordsByDate);
exports.getAssignments = functions.https.onRequest(getAssignments);
exports.createUserIdsWithExcelFile = functions.https.onRequest(createUserIdsWithExcelFile);
exports.createClasses = functions.https.onRequest(createClasses);
initializeApp();
