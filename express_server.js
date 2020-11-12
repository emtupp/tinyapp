// REQUIREMENTS

const { urlsForUser, generateRandomString /*, authenticateUser, fetchUser*/ } = require('./helpers');
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

// const password = "purple-monkey-dinosaur"; // found in the req.params object
// const hashedPassword = bcrypt.hashSync(password, 10);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

app.set("view engine", "ejs");


// DATABASE

const users = {}

const urlDatabase = {};


// HEADER NEED TO BE CHANGED TO SHOW EMAIL


// SERVER SETUP

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// REGISTER NEW USER

app.get("/register", (req, res) => {
  const templateVars = { user_id: req.session.user_id };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const user = generateRandomString();
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Please enter a valid email and password.');
  } else {
    for (let userIDs in users) {
      if (req.body.email === users[userIDs].email) {
        return res.status(400).send('This email is already in use.');
      }
    }
  }
  users[user] = {
     id: user,
     email: req.body.email,
     password: bcrypt.hashSync(req.body.password, 10)
    };
    console.log(users[user])
  req.session.user_id = user;
  res.redirect("/urls");
});


// USER LOGIN

app.get("/login", (req, res) => {
  const templateVars = { user_id: req.session.user_id };
  res.render("login", templateVars);
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (users === {}) {
    return res.redirect('login')
  }
  for (let user in users) {
    let validUser;
    if (email === users[user].email) {
      validUser = users[user];
      if (bcrypt.compareSync(password, validUser.password)) {
        
        req.session.user_id = user;
        res.redirect("/urls");
      }
    }
  }
  res.status(403).send('eMail or password is invalid');
});


// USER LOGOUT

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


// ROUTES FROM /urls

app.get("/urls", (req, res) => {
  const templateVars = { user_id: req.session.user_id };
  templateVars.urls = urlsForUser(templateVars.user_id, urlDatabase);
  res.render("urls_index", templateVars);
});

// edits current short URL and changes assiciated long URL
app.post("/urls/:id/edit", (req, res) => {
  const foundUserID = req.session.user_id;
  const foundUser = users[foundUserID].id;
  const id = req.params.id;
  const userAccess = urlDatabase[id].userID;
  if (foundUserID && foundUser) {
    if (foundUser === userAccess) {
      urlDatabase[id].longURL = req.body.id;
      res.redirect("/urls")
    }
  }
  res.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const foundUserID = req.session.user_id;
  const foundUser = users[foundUserID].id;
  const shortURL = req.params.shortURL;
  const userAccess = urlDatabase[shortURL].userID;
  if (foundUserID && foundUser) {
    if (foundUser === userAccess) {
      const shortURL = req.params.shortURL;
      delete urlDatabase[shortURL];
      res.redirect('/urls')
    }
  }
  res.redirect('/urls');
});


// CREATE AND EDIT URLs

// opens new URL
app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: req.session.user_id };
  if (!templateVars.user_id) {
    // console.log(templateVars.user_id);
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

// creates new short URL and upens short URL page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  // console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);
});

// path to short URL page
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id
  const shortURL = req.params.shortURL;
  const templateVars = {
    user_id,
    shortURL,
    longURL: urlDatabase[shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// opens long URL using short URL hyperlink
app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// OTHER ROUTES


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});