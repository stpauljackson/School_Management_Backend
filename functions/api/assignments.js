const os = require('os');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Save files to OS's temporary directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Append unique suffix to file name
  }
});

const upload = multer({ storage: storage }).single('file');

exports.uploadFile = (req, res) => {
  upload(req, res, async (err) => { 
    try {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).send('Multer error: ' + err.message);
      } else if (err) {
        console.error('Other error:', err);
        return res.status(500).send('Error: ' + err.message);
      }

      if (!req.file) {
        console.log('No file selected');
        return res.status(400).send('No file selected');
      }

      const tempFilePath = req.file.path;
      const originalFileName = req.file.originalname;

      const uniqueFileName = uuidv4() + path.extname(originalFileName);
      const newFilePath = path.join(os.tmpdir(), uniqueFileName);

      fs.renameSync(tempFilePath, newFilePath);

      const bucket = admin.storage().bucket();
      await bucket.upload(newFilePath, {
        destination: `uploads/${uniqueFileName}`,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      fs.unlinkSync(newFilePath);

      return res.status(200).send('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).send('Error uploading file');
    }
  });
};
