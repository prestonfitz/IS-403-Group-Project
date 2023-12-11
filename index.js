// Intex Project
// This is the index.js page. It is the brains of the node application that links everything together. 
// Alex Fankhauser, Seth Brock, Zach Hansen, Preston Fitzgerald
// Section 1 Group 11

// import packages and prep apps. Express is for running the backend, express-session is for baking cookies. 
const express = require('express');
const session = require('express-session');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();

// Use ejs to get access to database and other fun things
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

// Preheating the oven. We don't have a very strong lock on our oven
app.use(session({
    secret: 'your_secret_key', // This should be a long and random string, but it isn't
    resave: false, // Don't save the session if nothing changed
    saveUninitialized: true, // Save new sessions even if not modified
    cookie: {
      maxAge: 60 * 60 * 1000, // Cookie expires in 1 hour, so eat up
      httpOnly: true, // Prevent JavaScript access to the cookie. Otherwise it would put it in a cookie JAR
    },
  }));

// This app knex the website to a database. 
const knex = require('knex')({
  client: 'pg',
  connection: {
      host: process.env.RDS_HOSTNAME || 'localhost',
      user: process.env.RDS_USERNAME || 'postgres',
      password: process.env.RDS_PASSWORD || '4preston',
      database: process.env.RDS_DB_NAME || 'project403',
      port: process.env.RDS_PORT || 5432,
      ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false
    }
  });

// Because we want it to look nice
app.use(express.static(path.join(__dirname, '/views')));

//Log in log out functions
//log in
app.post('/validate',(req,res) => { //This is the route called by the login function
    knex.select('Email').from('Users').then(uname =>{
      for (icount = 0; icount < uname.length; icount++){
      if (uname[icount].Email == req.body.username){
        icount = uname.length;
        knex.select('Password','UserID', 'Email').from('Users').where('Email',req.body.username).then(pass =>{
          if (pass[0].Password == req.body.password)
          {
            req.session.loggedIn = true;
            req.session.userid = pass[0].UserID;
            req.session.email = pass[0].Email;
            req.session.save(function (err) { //this is what we were missing for a while when baking cookies
              if (err) return next(err)
            });
          }
        })
      }
      
    }
    res.redirect('/loggedin')
    });
})

// These routes write

// This function gets the timestamp of the survey submission
function getTodayDate() {
  // Implement this function as per your requirement
  // For example, you can use the JavaScript Date object
  return new Date().toISOString();
}
// this is a senior accountant (creates accounts)
app.post("/newAccount", (req, res)=> {
  // grab the usernames from the Accounts table in our database and push them to an array
  knex.select('Email').from('Users').then(uname =>{
    let aUsernames = [];
    let limit = uname.length;
    for(iCount = 0; iCount < limit; iCount++)
    {
      console.log('uname: ' + String(uname.length))
      aUsernames.push(uname[0].Email);
      uname.shift();
    }
    // check to see if the username is available and if it is, add the account to the database
    if (!aUsernames.includes(req.body.email)){
    knex("Users").insert({
      FirstName: req.body.fname,
      LastName: req.body.lname,
      Phone: req.body.phone,
      Email: req.body.email,
      OrgName: req.body.orgname,
      Password: req.body.pword,
      ProfilePicURL: req.body.profpic,
      DateCreated: getTodayDate()
   }).then(account => {});
  }
  // if the username is not available, send them to the recreate page
  // to do some javascript
  else{return res.render('recreate')}

  // redirect to the account page after successful creation
  res.redirect("/login");
 })
});

// protected functions
// This helps the login page determine if it needs to generate an error message
app.use('/loggedin', (req, res, next) => {
  if (!req.session.loggedIn) {
    return res.redirect('/relogin');
  }

  next();
})


// pages
//log in and log out

//This is when you mess up your login
app.get('/relogin', (req,res) =>{
  res.render('relog')
})

// these are log in log out pages designed to simply set a session storage variable
app.get('/loggedin', (req, res) => {
  res.render('loggedin')
});

app.get('/loggedOut', (req, res) =>{
  res.render('loggedOut')
});

//create a new account
app.get('/createAccount', (req, res) =>{
  res.render('createAccount')
});

// homepage
app.get("/", (req, res) => {      
    res.render('index');
});

// log in
app.get("/login", (req, res) => {
  res.render('login');
});

// trainings
app.get("/trainings", (req, res) => {
  res.render('trainings');
});

// display a training
app.post("/displayTraining", (req, res) => {
  console.log(req.body.trainingName);
  const trainingName = req.body.trainingName;
  res.render("displayTraining", {name: trainingName});
});    

// about
app.get("/about", (req, res) => {
  res.render('about');
});

// Yahtzee - this file is used to make sure that everything works
app.get("/hw7", (req, res) => {
    res.sendFile(path.join(__dirname + '/html/hw7/hw7.html'))
});

// set to listen
app.listen( port, () => console.log('Server is listening'));