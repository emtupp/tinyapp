const generateRandomString = function() {
  let formOutput = Math.random().toString(36).substring(2,8);
  return formOutput;
};

const urlsForUser = function(id, db) {
  let userUrlDb = {};
  console.log('db is: ', db)
  for (let item in db) {
    if (id === db[item].userID) {
      userUrlDb[item] = db[item];
    }
  }
  console.log(userUrlDb)
  return userUrlDb;
}

// const authenticateUser = (db, email, password) => {
//   for (const user of db) {
//     if (user.email === email) {
//       if (user.password === password) {
//         return { error: null, user }
//       } else {
//         return { error: 'password', user: null }
//       }
//     }
//   }
//   return { error: 'email', user: null }
// }

// const fetchUser = (db, email) => {
//   for (const user of db) {
//     if (user.email === email) {
//       return { error: null, user }
//     }
//   }
//   return { error: 'email', user: null }
// }

module.exports = { urlsForUser, generateRandomString /*, authenticateUser, fetchUser*/ }