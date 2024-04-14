var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/login-page', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Define a schema for user data
var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Create a model from the schema
var User = mongoose.model('User', userSchema);

app.post("/sign_up", (req, res) => {
    var { username, email, password } = req.body;

    var newUser = new User({
        username: username,
        email: email,
        password: password
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error registering new user.");
        } else {
            console.log("Record Inserted Successfully");
            res.redirect('signup_success.html');
        }
    });
});

app.post("/login", (req, res) => {
    var { email, password } = req.body;

    User.findOne({ email: email, password: password }, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.redirect('/RYR.html');
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('login.html');
});

app.listen(3000, () => {
    console.log("Listening on PORT 3000");
});

// Serve 'RYR.html' from the 'public' directory
app.get("/RYR.html", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/RYR.html'));
});

// Serve 'login.html' from the same directory as 'RYR.html'
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});
