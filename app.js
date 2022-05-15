//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is Kayen's personal blog site!! Feel free to take a look, I made this as part of a web development bootcamp I am doing. I am currently working at Scotiabank as an automation developer and am super happy! Can't wait to see where I go, I'm truly so excited. Check out the about page for instructions on how to make a post.";
const aboutContent = "This is a personal blog website that I (Kayen) made to learn about EJS, Express and other modules within node.js. To use this site, enter the domain (ex. localhost:3000) to go to the home and see the posts, to make a post add the path /posts/compose to the url. To see any post you can click read more! Hope you enjoy!!!!";
const contactContent = "You can contact me at my linkedIn: https://www.linkedin.com/in/kayen-mehta/ or shoot me an email at k47mehta@uwaterloo.ca";

const app = express();

//set up mongoose connection to the mongodb atlas cloud platform
mongoose.connect("mongodb://localhost:27017/blogDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postsSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("post", postsSchema);


app.get("/", function(req, res){
  Post.find({}, function(err, posts){   //reads the posts that are saved in the blogDB and passes those into the home ejs file as JS object variables
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){    //saves the created post to db and then only loads the home page if the post is saved and there are no errors
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, foundPost){
    if (err){
      console.log(err);
    }
    else{
      res.render("post", {    //renders the post ejs page passing in the found post's title and body
        title: foundPost.title,
        content: foundPost.content
      });
    }

  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
