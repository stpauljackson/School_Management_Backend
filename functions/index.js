const functions = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");

const { saveAttendance } = require('./api/attendance');
const { getAllStudentsfromClass } = require("./api/teacher");
const { saveMarks } = require("./api/savemarks");
const { getClass } = require("./api/getclass");
const { getAllTests, createNewTest } = require("./api/getAllTests");

exports.saveAttendance = functions.https.onRequest(async (req, res) => {
    saveAttendance(req, res);
});

exports.saveMarks = functions.https.onRequest(async (req, res) => {
    saveMarks(req, res);
});

exports.getAllStudentsfromClass = functions.https.onRequest(async (req, res) => {
    getAllStudentsfromClass(req, res);
});

exports.getClass = functions.https.onRequest(async (req, res) => {
    getClass(req, res);
});

exports.getAllTests = functions.https.onRequest(async (req, res) => {
    await getAllTests(req, res); 
});

exports.createNewTest = functions.https.onRequest(async (req, res) => {
    await createNewTest(req, res); 
});

initializeApp();

