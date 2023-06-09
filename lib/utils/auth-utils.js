const { userPool, AmazonCognitoIdentity } = require('./userPool');

// define sign up function that implements cognito sign in through the userPool object
const signUp = (email, password) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        // we believe this is where the response from sign up comes from
        resolve(result);
      }
    });
  });
};

// define sign in function that implements cognito sign in through the userPool object
const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
      });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

// define sign out function that implements cognito sign out through the userPool object
function signOut(email) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.signOut();

    // You could also check the current session to ensure the user is signed out
    cognitoUser.getSession((err, session) => {
      if (err || !session.isValid()) {
        resolve();
      } else {
        reject('User is still signed in');
      }
    });
  });
}

module.exports = { signUp, signIn, signOut };
