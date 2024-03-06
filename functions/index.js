const functions = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");

const {saveAttendance} = require("./api/attendance");
const {getAllStudentsfromClass} = require("./api/teacher");
const {saveMarks} = require("./api/savemarks");

exports.saveAttendance = functions.https.onRequest(async (req, res) => {
  saveAttendance(req, res);
});
exports.saveMarks = functions.https.onRequest(async (req, res) => {
  saveMarks(req, res);
});

exports.getAllStudentsfromClass = functions.https.onRequest(async (req, res) => {
    getAllStudentsfromClass(req, res);
});

initializeApp();

