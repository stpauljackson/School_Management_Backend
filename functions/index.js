const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

const { saveAttendance } = require('./api/attendance');
const { getAllStudentsfromClass } = require("./api/teacher");
const { saveMarks } = require("./api/savemarks");

exports.saveAttendance = onRequest(async (req, res) => {
  saveAttendance(req, res)
});

exports.saveMarks = onRequest(async (req, res) => {
  saveMarks(req, res);
});

exports.getAllStudentsfromClass = onRequest(async (req, res) => {
  getAllStudentsfromClass(req, res)
});
 
initializeApp();

