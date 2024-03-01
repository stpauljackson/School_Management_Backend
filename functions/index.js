const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

const { saveAttendance } = require('./api/attendance');
const { getAllStudentsfromClass } = require("./api/teacher");
const { saveMarks } = require("./api/savemarks");
const { getClass } = require("./api/getclass");

exports.saveAttendance = onRequest(async (req, res) => {
  ///saveAttendance(req, res)
  try {
    console.log('Request Body for saveAttendance:', req.body);

    // Add more logging as needed

    saveAttendance(req, res);
  } catch (error) {
    console.error('Error in saveAttendance:', error);
    return res.status(500).send('Internal server error.');
  }

});

exports.saveMarks = onRequest(async (req, res) => {
  // saveMarks(req, res);
  try {
    console.log('Request Body for saveMarks:', req.body);

    // Add more logging as needed

    saveMarks(req, res);
  } catch (error) {
    console.error('Error in saveMarks:', error);
    return res.status(500).send('Internal server error.');
  }
});

exports.getAllStudentsfromClass = onRequest(async (req, res) => {
  // getAllStudentsfromClass(req, res)
  try {
    console.log('Request Body for getAllStudentsfromClass:', req.body);

    // Add more logging as needed

    getAllStudentsfromClass(req, res);
  } catch (error) {
    console.error('Error in getAllStudentsfromClass:', error);
    return res.status(500).send('Internal server error.');
  }

});

exports.getClass = onRequest(async (req, res) => {
  // getClass(req, res)
  try {
    console.log('Request Body for getClass:', req.body);

    // Add more logging as needed

    getClass(req, res);
  } catch (error) {
    console.error('Error in getClass:', error);
    return res.status(500).send('Internal server error.');
  }
});

initializeApp();

