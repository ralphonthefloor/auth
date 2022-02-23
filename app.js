require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME);

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
const newUser = new User({
  email: req.body.username,
  password: md5(req.body.password)
});
newUser.save(function(err){
  if(err){
    console.log(err);
  } else {
    res.render("secrets");
  }
});
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function (err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser.password === md5(password)){
        res.render("secrets");
      } else {
        console.log("User credentials invalid");
        res.render("home");
      }
      }
    });
  });


app.listen(3000, function() {
  console.log("Server is listening on port 3000")
});
