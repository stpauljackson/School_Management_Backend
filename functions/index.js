// TODO : for future use hash of data to check if data is changed 
const functions = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");

const { saveAttendance } = require("./api/teacher/attendance.js");
const { getAllStudentsfromClass, getCalendar } = require("./api/common/teacher.js");
const { saveMarks } = require("./api/teacher/savemarks.js");
const { getClass } = require("./api/common/getclass.js");
const { getAllTests, createNewTest } = require("./api/teacher/getAllTests.js");
const { fetchEvents } = require("./api/common/fetchEvents.js");
const { uploadFile, getAssignments } = require("./api/common/assignments.js");
const {createUserIdsWithExcelFile,createClasses,getClasses,getUsersByClassOrSchool,createUsersWithId, getDashboard} = require("./api/admin/admin.js");
const {createAnnouncements} = require("./api/admin/createAnnouncements.js");
const { addHoliday } = require("./api/admin/addHoliday.js");

exports.saveAttendance = functions.https.onRequest(saveAttendance);
exports.saveMarks = functions.https.onRequest(saveMarks);
exports.getAllStudentsfromClass = functions.https.onRequest(getAllStudentsfromClass);
exports.getClass = functions.https.onRequest(getClass);
exports.getAllTests = functions.https.onRequest(getAllTests);
exports.createNewTest = functions.https.onRequest(createNewTest);
exports.fetchEvents = functions.https.onRequest(fetchEvents);
exports.getCalendar = functions.https.onRequest(getCalendar);
exports.uploadFile = functions.https.onRequest(uploadFile);
exports.getAssignments = functions.https.onRequest(getAssignments);
exports.createUserIdsWithExcelFile = functions.https.onRequest(createUserIdsWithExcelFile);
exports.createClasses = functions.https.onRequest(createClasses);
exports.getClasses = functions.https.onRequest(getClasses);
exports.createAnnouncements = functions.https.onRequest(createAnnouncements); 
exports.getUsersByClassOrSchool = functions.https.onRequest(getUsersByClassOrSchool);
exports.createUsersWithId = functions.https.onRequest(createUsersWithId);
exports.getDashboard = functions.https.onRequest(getDashboard);
exports.addHoliday = functions.https.onRequest(addHoliday);
initializeApp();
