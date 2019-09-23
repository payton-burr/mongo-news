const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require("path");

let PORT = process.env.PORT || 3000;
let app = express();

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";

mongoose.connect(MONGODB_URI);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

require('./routes/routes')(app);

app.listen(PORT, function() {
    console.log('App runnong on port ' + PORT);
});
