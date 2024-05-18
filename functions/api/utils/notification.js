const admin = require("firebase-admin");

/**
 * Sends a notification to multiple device tokens.
 *
 * @param {string} title - The title of the notification.
 * @param {string} body - The body of the notification.
 * @param {Array<string>} deviceTokens - An array of device tokens to send the notification to.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of response objects.
 */
exports.sendNotification = async (title, body, deviceTokens) => {
    const messages = deviceTokens.map(deviceToken => {
        return {
            notification: {
                title: title,
                body: body,
            },
            token: deviceToken,
        };
    });

    const sendPromises = messages.map(message => {
        return admin.messaging().send(message);
    });

    return Promise.all(sendPromises)
        .then((responses) => {
            responses.forEach((response, index) => {
                console.log(`Successfully sent message to device - ${index}:`);
            });
            return responses;
        })
        .catch((error) => {
            console.error('Error sending messages:', error);
            throw error;
        });
};
