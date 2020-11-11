const generateRandomString = function() {
  let formOutput = Math.random().toString(36).substring(2,8);
  return formOutput;
};

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
module.exports = { generateRandomString /*, authenticateUser, fetchUser*/ }