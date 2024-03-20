const firebase = require("firebase-admin")


const formidable = require("formidable-serverless");
// const uuid = require("uuid-v4");

const { Storage } = require("@google-cloud/storage");

/**
 * This is the endpoint for uploading an assignment file
 * It expects a file and some metadata about the file to be sent in the request body
 * The request body should have the following fields:
 * - file: the actual file to be uploaded
 * - teacherId: the teacher's uid
 * - classId: the class's id where the assignment is assigned
 * - assignmentName: the name of the assignment
 *
 * The endpoint will then:
 * 1. Parse the form data
 * 2. Check if all the required fields are present
 * 3. Check if the file type is allowed
 * 4. Create a new document in the assignments collection of Firestore
 * 5. Upload the file to the default bucket in Google Cloud Storage
 * 6. Set the url of the uploaded file in the Firestore document
 * 7. Respond with the id of the Firestore document created
 */
exports.uploadFile = (req, res) => {
  // Parse the form data
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    // Handle errors while parsing the form data
    if (err) {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
      return;
    }

    // Get the file from the form data
    const file = files.file;

    // Check if the file is present
    if (!file) {
      res.status(400).json({ error: "no file to upload, please choose a file." });
      return;
    }

    // Get the file path and type
    const filePath = file.path;
    const fileType = file.type;

    // Check if the file type is allowed
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png", "text/plain"];

    if (!allowedTypes.includes(fileType)) {
      res.status(400).json({ error: "File type not allowed, only pdf, doc, docx, jpeg, png and text files are allowed." });
      return;
    }

    // Get the metadata from the form data
    const { teacherId, classId, assignmentName} = fields;

    // Check if all the required fields are present
    if (!teacherId || !classId || !assignmentName) {
      res.status(400).json({ error: "Please provide teacherId, classId and assignmentName in request body" });
      return;
    }

    try {
      // Create a new document in the assignments collection of Firestore
      const fileDocRef = firebase
        .firestore()
        .collection("assignments")
        .doc();

      // Upload the file to the default bucket in Google Cloud Storage
      const uploadResponse = await firebase
        .storage()
        .bucket("default_bucket")
        .upload(filePath, {
          metadata: {
            contentType: file.type,
          },
        });

      // Set the url of the uploaded file in the Firestore document
      await fileDocRef.set({
        teacherId,
        classId,
        assignmentName,
        url: uploadResponse[0].metadata.mediaLink,
        timestamp: Date.now(),
      });

      // Respond with the id of the Firestore document created
      res.status(200).json({ fileDocId: fileDocRef.id });
    } catch (err) {
      console.error("Error while uploading file: " + err);
      res.status(500).json({ error: err });
    }
  });
};

exports.getAssignments = async (req, res) => {
    try {
        const { teacherId, classId } = req.body;

        if (!teacherId || !classId) {
            return res.status(400).send('Bad Request: teacherId and classId are required.');
        }

        const assignmentsRef = admin.firestore().collection('assignments');
        const querySnapshot = await assignmentsRef
            .where('teacherId', '==', teacherId)
            .where('classId', '==', classId)
            .get();

        const assignments = [];
        querySnapshot.forEach(doc => {
            assignments.push(doc.data());
        });

        return res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return res.status(500).send('Internal server error.');
    }
};


