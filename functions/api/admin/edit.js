const admin = require('firebase-admin');

// Cloud Function to update user details
exports.updateUserDetails = async (req, res) => {
  // Log to check if the function is being hit
  console.log('updateUserDetails function triggered');

  const { DocumentID } = req.body; // Assume DocumentID is passed in the body to identify the user.
  
  // Check if DocumentID is provided
  if (!DocumentID) {
    console.error('No DocumentID provided');
    return res.status(400).send({ error: "Document ID is required" });
  }

  // Extract the fields to update from the request body
  const { firstName, lastName, fatherMobileNumber, aadhaarCardNumber } = req.body;

  // Log the values being passed for update
  console.log('Fields to update:', { firstName, lastName, fatherMobileNumber, aadhaarCardNumber });

  // Build the object dynamically with only the fields that were provided
  const updates = {};
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (fatherMobileNumber) updates.fatherMobileNumber = fatherMobileNumber;
  if (aadhaarCardNumber) updates.aadhaarCardNumber = aadhaarCardNumber;

  // If no fields to update are provided
  if (Object.keys(updates).length === 0) {
    console.error('No fields to update');
    return res.status(400).send({ error: "No fields to update" });
  }

  try {
    // Log before updating Firestore
    console.log(`Updating document with ID: ${DocumentID} with data:`, updates);

    // Update the user document in Firebase Firestore using the provided DocumentID
    await admin.firestore().collection('users').doc(DocumentID).update(updates);

    // Log after successful update
    console.log(`User document with ID: ${DocumentID} updated successfully`);

    // Return success response
    return res.status(200).send({ message: "User details updated successfully", updates });
  } catch (error) {
    // Log the error details
    console.error('Error updating user details:', error);
    return res.status(500).send({ error: "Failed to update user details" });
  }
};
