const firebase = require("firebase-admin")
const formidable = require("formidable-serverless");
const admin = require("firebase-admin");

exports.uploadFile = (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
      return;
    }

    const file = files.file;

    if (!file) {
      res.status(400).json({ error: "no file to upload, please choose a file." });
      return;
    }

    const filePath = file.path;
    const fileType = file.type;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png", "text/plain"];

    if (!allowedTypes.includes(fileType)) {
      res.status(400).json({ error: "File type not allowed, only pdf, doc, docx, jpeg, png and text files are allowed." });
      return;
    }

    const { teacherId, classId, assignmentName} = fields;

    if (!teacherId || !classId || !assignmentName) {
      res.status(400).json({ error: "Please provide teacherId, classId and assignmentName in request body" });
      return;
    }

    try {
      const fileDocRef = firebase
        .firestore()
        .collection("assignments")
        .doc();

      const uploadResponse = await firebase
        .storage()
        .bucket("edge-2060b")
        .upload(filePath, {
          metadata: {
            contentType: file.type,
          },
        });

      await fileDocRef.set({
        teacherId,
        classId,
        assignmentName,
        url: uploadResponse[0].metadata.mediaLink,
        timestamp: Date.now(),
      });

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
            assignments.push({id: doc.id, ...doc.data()});
        });

        return res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return res.status(500).send('Internal server error.');
    }
};


