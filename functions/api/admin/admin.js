const formidable = require("formidable-serverless");
const admin = require("firebase-admin");
const XLSX = require('xlsx');

exports.getDashboard = async (req, res) => {
    const schoolRef = admin.firestore().collection('Schools').doc(req.body.schoolId);
    const schoolDoc = await schoolRef.get();
    if (!schoolDoc.exists) {
        return res.status(400).json({ error: 'School does not exist' });
    }
    const schoolData = schoolDoc.data();
    return res.status(200).json(schoolData);
};

exports.createClasses = async (req, res) => {
    let { no_of_classes, no_of_sections, schoolId } = req.body;
    no_of_classes = Number(no_of_classes);
    no_of_sections = Number(no_of_sections);

    try {
        const array = [];
        const sections = Array.from({ length: no_of_sections }, (v, k) => String.fromCharCode(k + 65));
        const classesRef = admin.firestore().collection('classes');
        const batch = admin.firestore().batch();
        for (let i = 1; i <= no_of_classes; i++) {
            for (let j = 0; j < sections.length; j++) {
                const classData = { class: i, section: sections[j], schoolId };
                array.push(classData);
                const classDocRef = classesRef.doc();
                batch.set(classDocRef, classData);
            }
        }
        await batch.commit();

        res.status(200).json(array);
    } catch (error) {
        console.error('Error creating classes:', error);
    }
};

exports.getUsersByClassOrSchool = async (req, res) => {
    const { classId, schoolId,type } = req.body;
    try {
        let queryBuilder;
        if (type === 'student') {
            queryBuilder = admin.firestore().collection('users').where('classId', '==', classId).where('type', '==', type);
        } else {
            queryBuilder = admin.firestore().collection('users').where('schoolId', '==', schoolId).where('type', '==', type);
        }

        const querySnapshot = await queryBuilder.get();
        const users = [];

        querySnapshot.forEach(doc => {
            const userData = doc.data();
            users.push({ ...userData, id: doc.id });
        });
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: error.code });
    }
}
exports.assignClassToTeacher = async (req, res) => {
    const { teacherId, classId, classDetails } = req.body;
    try {
        const teacherRef = admin.firestore().collection('users').doc(teacherId);
        const classRef = admin.firestore().collection('classes').doc(classId);
        const batch = admin.firestore().batch();
        const currentClasses = (await teacherRef.get()).data().classes || [];
        currentClasses.push({ class: classDetails.class, classId: classId, section: classDetails.section, subject: classDetails.subject, subjectId: classDetails.subjectId });
        batch.set(teacherRef, { classes: currentClasses });
        batch.set(classRef, { teacherId });
        await batch.commit();
        res.status(200).json({ message: 'Class assigned successfully' });
    } catch (error) {
        console.error('Error assigning class:', error);
        return res.status(500).json({ error: error.code });
    }
}

exports.getClasses = async (req, res) => {
    const { schoolId } = req.body;

    try {
        const classesRef = admin.firestore().collection('classes');
        const query = classesRef.where('schoolId', '==', schoolId);
        const querySnapshot = await query.get();
        const classes = [];

        querySnapshot.forEach(doc => {
            const classData = doc.data();
            classes.push({ ...classData, id: doc.id });
        });

        res.status(200).json(classes);

    } catch (error) {
        console.error('Error fetching classes:', error);
        return res.status(500).json({ error: error.code });
    }
};


const createUsersWithId = async (users) => {
    try {
        const auth = admin.auth();
        const usersRef = admin.firestore().collection('users');

        //! security vulnerability
        const password = "Password" // TODO find better approach 

        const createUserPromises = users.map(async (user) => {
            const { email, firstName, ...info } = user;
            return auth.createUser({ email, displayName: firstName, password })
                .then(newUser => {
                    return usersRef.doc(newUser.uid).set({ id: newUser.uid, email, firstName,...info});
                });
        });

        return Promise.all(createUserPromises);
    } catch (error) {
        console.error('Error creating users:', error);
        return Promise.reject(error);
    }
};

const updateDashboard = async (type, schoolId) => {
    try {
      const schoolRef = admin.firestore().collection('Schools').doc(schoolId);
      const schoolDoc = await schoolRef.get();
  
      if (!schoolDoc.exists) {
        console.error('School does not exist');
        return;
      }
  
      const schoolData = schoolDoc.data();
      let updateData = {};
  
      if (type === 'student') {
        updateData = { no_of_students: (schoolData.no_of_students || 0) + 1 };
      } else if (type === 'teacher') {
        updateData = { no_of_teachers: (schoolData.no_of_teachers || 0) + 1 };
      } else if (type === 'employee') {
        updateData = { no_of_employees: (schoolData.no_of_employees || 0) + 1 };
      } else {
        console.error('Invalid type provided');
        return;
      }
  
      await schoolRef.update(updateData);
      console.log(`Successfully updated the number of ${type}s for school ${schoolId}`);
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  };

exports.createUsersWithId = async (req, res) => {
    try {
        const users = req.body.users;
        const createdUsers = await createUsersWithId([users]);
        await updateDashboard(users.type,users.schoolId)
        res.status(200).json(createdUsers);
    } catch (error) {
        console.error('Error creating users:', error);
        return res.status(500).json({ error: error.code });
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
    const col = ["email", "firstName", "lastName", "gender", "phoneNumber", "address", "dateOfBirth", "fatherName", 
    "fatherOccupation","fatherNationalId","fatherMobileNumber","fatherIncome", "fatherEducation", "motherName", 
    "motherOccupation", "motherNationalID", "motherEducation","motherIncome", "motherMobileNumber", "studentGovtIdNo.", "orphan", "religion", "identificationMark", 
    "Previous School", "previouisSchool", "bloodGroup", "boardRollNo", "totalSiblings"]
    const excelData = await readExcelFileAndReturnJson(filePath,col);
    excelData.forEach(user => {
      user.type = type;
      user.schoolId = schoolId;
      user.classId = classId;
    });

    await createUsersWithId(excelData);
    await updateDashboard(type,schoolId)
    res.status(200).json({message:"Users uploaded successfully"});
  });
};



// exports.createClasses = async (req, res) => {
//     let { no_of_classes, no_of_sections } = req.body;
//     no_of_classes = Number(no_of_classes);
//     no_of_sections = Number(no_of_sections);

//     try {
//         //const classesRef = admin.firestore().collection('classes');
//         //const batch = admin.firestore().batch();
//         const array = []
//         const sections = Array.from({ length: no_of_sections }, (v, k) => String.fromCharCode(k + 65));
//         for (let i = 1; i <= no_of_classes; i++) {
//            for (let j = 0; j < sections.length; j++)
//            {
//             array.push({class:i, section:sections[j]})
//            }
//             // const classDocRef = classesRef.doc();
            
//             //batch.set(classDocRef, { id: i, sections });
//         }
//         //await batch.commit();
//         res.status(200).json(array);
//     } catch (error) {
//         console.error('Error creating classes:', error);
//         return Promise.reject(error);
//     }
// };