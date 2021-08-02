const express = require('express');
const bodyParser = require('body-parser')
var mongoose = require("mongoose");
const {check, validationResult} = require('express-validator')
const app = express();
const exphbs = require('express-handlebars');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var clientSessions = require('express-session')

app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "unguessable", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));




mongoose.connect("private",{useNewUrlParser: true, useUnifiedTopology: true});


var Schema = mongoose.Schema;
var newschema = new Schema({
  "firstname":  String,
  "lastname": String,
  "email": String,
  "username": String,
  "isAdmin" : Boolean,
  "userCount": {
    "type": Number,
    "default": 0
  },
  "password": String  
});




var Company = mongoose.model("airbnb", newschema);



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nodejsjason@gmail.com',
    pass: 'Aug1998123!'
  }
});




app.engine('hbs', exphbs({defaultLayout: '/home', extname: '.hbs'}));
app.set('view engine', 'hbs');


app.use(express.static(__dirname + '/public'));

const urlencodedParser = bodyParser.urlencoded({extended:false})


// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

//routing 
app.get("/", (req, res) => {
    res.render("home", { layout: false }); 
});


app.get("/logout", function(req, res) {
  req.session = null;
  res.redirect("/");
});


app.get("/room", (req, res) => {
    res.render("room", { layout: false }); 
});

app.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", {user: req.session.user, layout: false});
});

app.get("/adminDashboard", ensureLogin, (req, res) => {
  res.render("adminDashboard", {user: req.session.user, layout: false});
});

//routing
app.get("/signup", (req, res) => {
  res.render("signup", { layout: false }); 
});

app.get("/login", (req, res) => {
  res.render("login", { layout: false }); 
});

// Post validation goes here
app.post("/signup",urlencodedParser, [
  check('firstname', 'firstname is required')
    .exists()
    .isLength({ min: 1}),
  check('lastname', 'lastname is required')
    .exists()
    .isLength({ min: 1}),
  check('username', 'username is required')
    .exists()
    .isLength({ min: 1}),
  check('email', 'Please enter a valid email')
    .isEmail()
    .normalizeEmail()
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        Company.findOne({email: req.body.email}, function(err, user){
          console.log( "The logged email is" + req.body.email)
          if(err) {
            reject(new Error('Server Error'))
          }
          if(Boolean(user)) {
            reject(new Error('E-mail already in use'))
          }
          resolve(true)
        });
      });
    }),
  check('password', 'Please enter a valid password')
    .exists()
    .isLength({min: 5})
], (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
      var errormsg = errors.errors[0].msg;
      console.log(errors)
  } 
  else
  {
    console.log("No more errors")

    var mailOptions = {
      from: 'nodejsjason@gmail.com',
      to: req.body.email, 
      subject: 'Activating your account',
      text: 'Hi, ' + req.body.firstname + " Welcome to your new Airbnb account!"
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    var newUser = new Company({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      isAdmin: true,
      email: req.body.email,
      userCount: 1,
      password: hash
    });
    
    // save the company
    newUser.save((err) => {
      if(err) {
        console.log("something went wrong!");
      } else {
        console.log("a new user was successfully added!");
      }
      
    
    });

    return res.redirect('/');


  }




});



//routing
app.post("/login",urlencodedParser, [
  check('username', 'username is required')
    .exists()
    .isLength({ min: 1})
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        Company.findOne({username: req.body.username}, function(err, user){
          console.log( "The logged username is " + req.body.username)
          if(err) {
            reject(new Error('Server Error'))
          }
          if(!Boolean(user)) {
            reject(new Error('ERROR: Username belongs to nobody'))
          }
          resolve(true)
        });
      });
    }),
  check('password', 'Please enter a valid password')
    .exists()
    .isLength({min: 1})
],async  (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
      var errormsg = errors.errors[0].msg;
      console.log(errors)
  } 
  else
  {
    console.log("No more errors")

    Company.find({ username:  req.body.username})
    .exec()
    .then((companies) => {
      //console.log(companies);
      const hashedPass = companies[0].password;

      const fname = companies[0].firstname;
      const lname = companies[0].lastname;
      const em = companies[0].email;
      const isAdmin = companies[0].isAdmin;

      console.log(companies[0]);
      
     if(bcrypt.compareSync(req.body.password, hashedPass))
     {
       console.log("Password matches!");
      req.session.user = {
      username: req.body.username,
      email: em,
      firstname: fname,
      lastname: lname,
      isadmin: isAdmin
    };

    //console.log("are they an admin? " + isAdmin);
    if(companies[0].isAdmin == true)
    {
      return res.redirect("/adminDashboard");
    }
    else
    {
    return res.redirect("/dashboard");
    }
  }
     else
     {
       console.log("password does not match");
       return res.render("login", { errorMsg: "invalid username or password!", layout: false});
     }


    });


  }




});


app.listen(8080, () => {
    console.log('Server is starting at port ', 8080);
})



