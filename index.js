let express = require('express');
let path = require("path");  

// make app an express object
let app = express();

app.use(express.static(path.join(__dirname, '/hw7')));
app.listen(3000, () => console.log('Server is Running'));


app.get("/", (req, res) => {      
    res.sendFile(path.join(__dirname + '/hw7/hw7.html'));
});   