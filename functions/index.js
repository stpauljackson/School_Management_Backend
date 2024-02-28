const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");

const {saveAttendance} = require('./attendance');
const { getAllStudentsfromClass } = require("./teacher");

exports.saveAttendance = onRequest(async (req, res) => {
    saveAttendance(req, res)
  });

exports.getAllStudentsfromClass = onRequest(async (req, res) => {
    getAllStudentsfromClass(req, res)
});
  
initializeApp();

