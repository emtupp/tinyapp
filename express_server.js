const generateRandomString = function() {
  let formOutput = Math.random().toString(36).substring(2,8);
  return formOutput;
};

const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");

const users = {}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("/login", (req, res) => {
  const user = req.body.user_id;
  res.cookie('user_id', user);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {user_id: req.cookies["user_id"]};
  res.render("urls_new", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  templateVars.user_id = req.cookies['user_id'];
  res.render("urls_index", templateVars);
})

app.post("/urls/:shortURL/delete", (req,res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.id;
  res.redirect("/urls")
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL };
  templateVars.longURL = urlDatabase[templateVars.shortURL];
  templateVars.user_id = req.cookies['user_id'];
  res.render("urls_show", templateVars);
});

app.post("/register", (req, res) => {
  const user = generateRandomString();
  if (req.body.email === '' || req.body.password === '') {
    res.status(400).send('Please enter a valid email and password.');
  } else {
    for (let userIDs in users) {
      if (req.body.email === users[userIDs].email) {
        res.status(400).send('This email is already in use.');
     }
    }
  }
  users[user] = {id: user, email: req.body.email, password: req.body.password};
  res.cookie('user_id', user);
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {user_id: req.cookies["user_id"]};
  res.render("register", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});