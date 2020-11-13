const generateRandomString = function() {
  let formOutput = Math.random().toString(36).substring(2,8);
  return formOutput;
};

const urlsForUser = function(id, db) {
  let userUrlDb = {};
  for (let item in db) {
    if (id === db[item].userID) {
      userUrlDb[item] = db[item];
    }
  }
  return userUrlDb;
};

const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return user;
    }
  }
  return undefined;
};

module.exports = { urlsForUser, generateRandomString, getUserByEmail };