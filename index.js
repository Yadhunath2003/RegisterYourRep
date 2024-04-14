var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/login-page',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

// Serve login.html when accessing the root URL
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Handle form submission from login.html
app.post("/sign_up",(req,res)=>{
    var username = req.body.username
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "username": username,
        "email" : email,
        "password" : password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
        // Redirect to signup_success.html after successful form submission
        res.sendFile(__dirname + '/public/signup_success.html');
    });
});

app.listen(3000, () => {
    console.log("Listening on PORT 3000");
});
