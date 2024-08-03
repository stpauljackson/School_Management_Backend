const ConnectyCube = require('connectycube');


exports.createUserWithCustomConnectyCubeId = async (customId, email, fullName) => {

const CREDENTIALS = {
        appId: 21,
        authKey: "hhf87hfushuiwef",
        authSecret: "jjsdf898hfsdfk",
      };
      
      ConnectyCube.init(CREDENTIALS);
  const config = {
    endpoints: {
      user: {
        customData: {
          customId: customId
        }
      },
      settings: {
        mode: ConnectyCube.MODE.OBJECT
      }
    }
  };

  const cqSettings = new ConnectyCube(config);

  const userProfile = {
    login: email,
    password: customId,
    full_name: fullName,
    customId: customId
  };

  try {
    const createdUser = await cqSettings.createUser(userProfile);
    console.log('User created:', createdUser);
    return createdUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error);
  }
};
