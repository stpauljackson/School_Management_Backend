const formidable = require("formidable-serverless");
const admin = require("firebase-admin");
const XLSX = require('xlsx');

const createUsersWithId = async (users) => {
    try {
        const auth = admin.auth();
        const usersRef = admin.firestore().collection('users');

        //! security vulnerability
        const password = "Password" // TODO find better approach 

        const createUserPromises = users.map(async (user) => {
            const { email, firstName, lastName, gender } = user;
            return auth.createUser({ email, displayName: firstName, password })
                .then(newUser => {
                    return usersRef.doc(newUser.uid).set({ id: newUser.uid, email, firstName });
                });
        });

        return Promise.all(createUserPromises);
    } catch (error) {
        console.error('Error creating users:', error);
        return Promise.reject(error);
    }
};

const readExcelFileAndReturnJson = async (filePath, header) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const excelData = XLSX.utils.sheet_to_json(sheet, {header:header});
  excelData.shift();
  return excelData;
}

exports.createUserIdsWithExcelFile = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error while parsing form: " + err);
      res.status(500).json({ error: err });
      return;
    }

    const file = files.file;
    const {type,schoolId,classId} = fields;

    if (!type || !schoolId || !classId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "no file to upload, please choose a file." });
      return;
    }

    const filePath = file.path;
    const excelData = await readExcelFileAndReturnJson(filePath,["email", "firstName", "lastName", "gender"]);
    excelData.forEach(user => {
      user.type = type;
      user.schoolId = schoolId;
      user.classId = classId;
    });

    await createUsersWithId(excelData);

    res.status(200).json({message:"Users uploaded successfully"});
  });
};



