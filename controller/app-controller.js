var express = require("express")
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars")
var cheerio = require("cheerio")
var request = require("request-promise")
// Require all models
var db = require("../models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/kotakudb";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var router = express.Router();

//get route for all articles 
router.get("/", function(req, res) {
    db.Article.find({})
    .sort({createdAt:-1})
    .then(function(data){
        console.log(data)
        var object = {articles:data}
        res.render("index", object)
    })
})

//get route for comments on article
router.get("/comment/:id", function(req, res){
    db.Article.findById(req.params.id)
    .populate("comment")
    .then(function(data){
        res.json(data)
    })
    .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
})

router.post("/comment/:id", function(req, res){
    db.Comment.create(req.body)
    .then(function(data) {
      // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findByIdAndUpdate(req.params.id, { $push: { comment: data._id } }, { new: true });
    })
    .then(function(updatedArticle) {
      // If the Library was updated successfully, send it back to the client
      console.log ("article updated:" + updatedArticle)
      res.json(updatedArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      console.log(err);
    });
})

router.get("/scrape", function (req,res){
    
    request("https://kotaku.com/", function(error, response, html) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("article").each(function(i, element) {

            var link = $(element).find(".js_entry-link").attr("href");
            var title = $(element).find(".headline").children().text();
            var summary = $(element).find(".entry-summary").children().text();

            if (!title) {
                title = $(element).find(".excerpt").children("p").children("strong").text();
            }

            var newArticle = {
                link: link,
                title: title,
                summary: summary
            }

            console.log(newArticle)
            
            // Save these results in an object that we'll push into the results array we defined earlier
            if (title && link && summary){
                db.Article.create(newArticle)
                .catch(function(err){
                    console.log(err)
                })
            }
        })
   
    })
    .then(function(){
        res.redirect("/");
    })
    .catch(function(err){
        console.log(err)
    })
})

module.exports = router

