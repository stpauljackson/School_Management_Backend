const firebase = require("firebase-admin")


const formidable = require("formidable-serverless");
// const uuid = require("uuid-v4");

const { Storage } = require("@google-cloud/storage");

exports.uploadFile = async (req, res) => {
  var form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      var file = files.file;
      if (!file) {
        reject(new Error("no file to upload, please choose a file."));
        return;
      }
      var filePath = file.path;
      console.log("File path: " + filePath);

      // let //uuid = UUID();

      // const storage = new Storage({
      //   keyFilename: "service-account.json",
      // });


      const response = await firebase.storage().bucket("default_bucket").upload(filePath, {
        contentType: file.type,
        // metadata: {
        //   metadata: {
        //     firebaseStorageDownloadTokens: uuid,
        //   },
        // },
      });

      // const fullMediaLink = response[0].metadata.mediaLink + "";
      // const mediaLinkPath = fullMediaLink.substring(
      //   0,
      //   fullMediaLink.lastIndexOf("/") + 1
      // );
      // const downloadUrl =
      //   mediaLinkPath +
      //   encodeURIComponent(response[0].name) +
      //   "?alt=media&token=" +
      //   uuid;

      // console.log("downloadUrl", downloadUrl);

      resolve({ fileInfo: response[0].metadata /*, downloadUrl*/ });
    });
  })
    .then((response) => {
      res.status(200).json({ response });
      return null;
    })
    .catch((err) => {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
    });
}