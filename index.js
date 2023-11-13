let express = require('express');
let path = require("path");  

// make app an express object
let app = express();

app.use(express.static(path.join(__dirname, '/html')));
app.listen(3000, () => console.log('Server is Running'));


app.get("/", (req, res) => {      
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get("/hw7", (req, res) => {
    res.sendFile(path.join(__dirname + '/html/hw7/hw7.html'))
});