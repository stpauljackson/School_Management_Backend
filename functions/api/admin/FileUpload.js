const firebase = require("firebase-admin")
const formidable = require("formidable-serverless");

exports.uploadImage = (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
      return;
    }

    const image = files.image;

    if (!image) {
      res.status(400).json({ error: "No image to upload, please choose an image." });
      return;
    }

    const imagePath = image.path;
    const imageType = image.type;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(imageType)) {
      res.status(400).json({ error: "File type not allowed, only JPEG and PNG images are allowed." });
      return;
    }

    const { classId, schoolId } = fields;

    if (!classId || !schoolId ) {
      res.status(400).json({ error: "Please provide classId and schoolId in the request body." });
      return;
    }

    try {
      const imageDocRef = firebase.firestore().collection("images").doc();

      const uploadResponse = await firebase.storage().bucket("edge-2060b").upload(imagePath, {
        metadata: {
          contentType: image.type,
        },
      });

      await imageDocRef.set({
        classId,
        schoolId,
        url: uploadResponse[0].metadata.mediaLink,
        timestamp: Date.now(),
      });

      res.status(200).json({ imageDocId: imageDocRef.id });
    } catch (err) {
      console.error("Error while uploading image: " + err);
      res.status(500).json({ error: err });
    }
  });
};

exports.getImages = async (req, res) => {
  try {
    const { classId, schoolId } = req.body;

    if (!classId || !schoolId) {
      return res.status(400).send('Bad Request: classId and schoolId are required.');
    }

    const imagesRef = firebase.firestore().collection('images');

    const querySnapshot = await imagesRef
      .where('classId', '==', classId)
      .where('schoolId', '==', schoolId)
      .get();

    const images = [];
    querySnapshot.forEach(doc => {
      images.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).send('Internal server error.');
  }
};

exports.getImageById = async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!imageId) {
      return res.status(400).send('Bad Request: imageId is required.');
    }

    const imageDoc = await firebase.firestore().collection('images').doc(imageId).get();

    if (!imageDoc.exists) {
      return res.status(404).send('Image not found.');
    }

    return res.status(200).json({ id: imageDoc.id, ...imageDoc.data() });
  } catch (error) {
    console.error('Error fetching image:', error);
    return res.status(500).send('Internal server error.');
  }
};