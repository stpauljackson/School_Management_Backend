const admin = require("firebase-admin");

exports.sendNotification = (title, body, deviceTokens) => {
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
