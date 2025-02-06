const admin = require('firebase-admin');

exports.updateUserDetails = async (req, res) => {

console.log(req.body)
  const { DocumentID } = req.body;

  if (!DocumentID) {
    return res.status(400).send({ error: "Document ID is required" });
  }

  const { firstName, lastName, fatherMobileNumber, aadhaarCardNumber,phoneNumber,address } = req.body;

  const updates = {};
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (fatherMobileNumber) updates.fatherMobileNumber = fatherMobileNumber;
  if (aadhaarCardNumber) updates.aadhaarCardNumber = aadhaarCardNumber;
  if (phoneNumber) updates.phoneNumber = phoneNumber;
  if (address) updates.address = address;

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ error: "No fields to update" });
  }

  try {
    await admin.firestore().collection('users').doc(DocumentID).update(updates);

    return res.status(200).send({ message: "User details updated successfully", updates });
  } catch (error) {
    return res.status(500).send({ error: "Failed to update user details" });
  }
};

