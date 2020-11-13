// REQUIREMENTS

const { urlsForUser, generateRandomString, getUserByEmail } = require('./helpers');
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

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




// SERVER SETUP

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// REGISTER NEW USER

app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const templateVars = { user: null };
  const userID = generateRandomString();
  if (req.body.email === '' || req.body.password === '') {
    res.render('register_error', templateVars);
  } else {
    if (getUserByEmail(req.body.email, users)) {
      res.render("register_error", templateVars);
    }
  }
  users[userID] = {
     id: userID,
     email: req.body.email,
     password: bcrypt.hashSync(req.body.password, 10)
    };
  req.session.user_id = userID;
  res.redirect("/urls");
});


// USER LOGIN

app.get("/login", (req, res) => {
  const templateVars = { user: null };
  res.render("login", templateVars);
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (bcrypt.compareSync(password, users[user].password)) {
    req.session.user_id = user;
    res.redirect("/urls");
  }
  res.status(403).send('eMail or password is invalid!');
});

// USER LOGOUT

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});


// ROUTES FROM /urls

app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];
  const urls = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = { user, urls };
  if (!user) {
    res.redirect("/login_error")
  }
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
  const user = users[req.session.user_id];
  const templateVars = { user };
  if (!user) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

// creates new short URL and upens short URL page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// path to short URL page
app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id];
  const shortURL = req.params.shortURL;
  const templateVars = {
    user,
    shortURL,
    longURL: urlDatabase[shortURL].longURL
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const foundUserID = req.session.user_id;
  const foundUser = users[foundUserID].id;
  const shortURL = req.params.shortURL;
  const userAccess = urlDatabase[shortURL].userID;
  if (foundUserID && foundUser) {
    if (foundUser === userAccess) {
      const id = req.params.id;
      res.redirect(`/urls/${id}`);
    }
  }
  res.send("<html><body>You do not own this TinyURL</body></html>\n")
});

// opens long URL using short URL hyperlink
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/u/:id", (req, res) => {
  const thisWebsite = urlDatabase[req.params.shortURL].longURL;
  res.redirect(thisWebsite);
}); // ******


// OTHER ROUTES


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect('/login')
  }
  res.redirect('/urls')
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// error: not logged in
app.get("/login_error", (req, res) => {
  const templateVars = { user: null };
  res.render("error_login", templateVars)
})