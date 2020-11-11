// REQUIREMENTS

const { generateRandomString /*, authenticateUser, fetchUser*/ } = require('./helpers');
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");


// DATABASE

const users = {};

let urlDatabase = {
  "b2xVn2": { "longURL": "http://www.lighthouselabs.ca", "userID": ''},
  "9sm5xK": { "longURL": "http://www.google.com", "userID": ''}
};


// SERVER SETUP

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// REGISTER NEW USER

app.get("/register", (req, res) => {
  const templateVars = {user_id: req.cookies["user_id"]};
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
  users[user] = {id: user, email: req.body.email, password: req.body.password};
  console.log(users[user])
  console.log('users is: ', users)
  res.cookie('user_id', user);
  res.redirect("/urls");
});


// USER LOGIN

app.get("/login", (req, res) => {
  const templateVars = {user_id: req.cookies["user_id"]};
  res.render("login", templateVars);
})

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (users === {}) {
    return res.redirect('login')
  }
  for (let user in users) {
    if (email === users[user].email) {
      if (password === users[user].password) {
        res.cookie('user_id', user);
        return res.redirect("/urls");
      }
    }
    res.status(403).send('eMail or password is invalid');
    res.redirect('login');
  }
});


// USER LOGOUT

app.get("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


// ROUTES FROM /urls

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  templateVars.user_id = req.cookies['user_id'];
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});


// CREATE AND EDIT URLs

// opens new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {user_id: req.cookies["user_id"]};
  if (!templateVars.user_id) {
    console.log(templateVars.user_id);
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

// creates new short URL and upens short URL page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase += shortURL;
  // urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);
});

// path to short URL page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL };
  templateVars.longURL = urlDatabase[templateVars.shortURL];
  templateVars.user_id = req.cookies['user_id'];
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

// edits current short URL and changes assiciated long URL
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.id;
  res.redirect("/urls")
});

// opens long URL using short URL hyperlink
app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL];
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