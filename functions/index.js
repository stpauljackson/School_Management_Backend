const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

const { saveAttendance } = require('./api/attendance');
const { getAllStudentsfromClass } = require("./api/teacher");
const { saveMarks } = require("./api/savemarks");
const { getClass } = require("./api/getclass");


exports.saveAttendance = onRequest(async (req, res) => {
    saveAttendance(req, res);
});

exports.saveMarks = onRequest(async (req, res) => {
    saveMarks(req, res);
});

exports.getAllStudentsfromClass = onRequest(async (req, res) => {
    getAllStudentsfromClass(req, res);
});

exports.getClass = onRequest(async (req, res) => {
    getClass(req, res);
});

exports.getAllTests = onRequest(async (req,res) => {
    this.getAllTests(req,res);
});

initializeApp();

