let express = require('express');
let path = require("path");  

// make app an express object
let app = express();

// load static
app.use(express.static(path.join(__dirname, '/html')));

// Let the console know that the server is up
app.listen(3000, () => console.log('Server is Running'));

// homepage
app.get("/", (req, res) => {      
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

// log in
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + '/html/login.html'))
});

// Yahtzee - this file is used to make sure that everything works
app.get("/hw7", (req, res) => {
    res.sendFile(path.join(__dirname + '/html/hw7/hw7.html'))
});
