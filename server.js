const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3000;

const app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";

mongoose.connect(MONGODB_URI);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/scrape', function(req, res) {
    axios.get('').then(function(response) {
        let $ = cheerio.load(response.data);

        $('').each(function(i, element) {
            let result = {}

            result.title = $(this)
            result.link = $(this)

            console.log(result.title);
            console.log(result.link);

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle)
            }).catch(function(err) {
                console.log(err);
            });
        });
        res.send("Scrape Compete");
    });
});

app.get('/articles', function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get('articles/:id', function(req, res) {
    db.Article.findOne({ _id: req.params.id }).populate('note').then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post('/articles/:id', function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.param.id }, { note: dbNote._id }, { new: true });
    }).then(function(dbArticle) {
        res.json(dbArticle).catch(function(err) {
            res.json(err);
        })
    })
})

app.listen(PORT, function() {
    console.log('App runnong on port ' + PORT);
});
