// Procfile is must if we want to deploy our website on Heroku
// creating .env file in order to store my API keys there
// whatever files I have specified in .gitignore file that will be ignored by github
// all the static files must be inside "public" folder like css files, js files and images
// all the ejs files must be inside "views" folder
// views folder must be at same hierarchical level as app.js

//    <%= %>     this is an ejs marker
// if I am writing some javascript logic in my ejs file then that must be written inside <% %>
// basically <% %> tag is called the scriptlet tag in ejs


require('dotenv').config(); //module for creating .env file
const express = require("express"); //for server side rendering
const bodyParser = require('body-parser'); //for using req.body command
const ejs = require('ejs'); //used to embed javascript to HTML pages
const mongoose = require('mongoose'); //for the database
const cookieParser = require('cookie-parser'); //for using session cookie in my website
const https = require('https'); //for calling the APIs
const fetch = require("node-fetch"); //for fethcing API calls to node js

const bcrypt = require('bcryptjs'); //for converting password to salt and hash
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.use(cookieParser());

app.locals.arr = [];

//connecting the website to the mongoDB database
mongoose.connect('mongodb+srv://' + process.env.DATABASE_USERNAME + '@cluster0.otbtt.mongodb.net/newsUserDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//this is the database connectivity with my localhost
// mongoose.connect('mongodb://localhost:27017/newsUserDB', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

// deriving schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  preferences: [String]
});

//compiling schema into a model
const User = mongoose.model('User', userSchema);

let username = "";
const weatherApiKey = process.env.WEATHER_API_KEY;


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getNews(url, news) {

  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();

  // pushing this data to the news[] array
  Array.prototype.push.apply(news, data.articles);

  return await news;
}


//get request to home route
app.get("/", function(req, res) {
  res.render("home");
});

//get request to register route
app.get("/register", function(req, res) {
  res.render("register", {
    correctEmailFormat: true,
    emailMatch: false,
    passwordMatch: true
  });
});

//get request to login route
app.get("/login", function(req, res) {
  res.render("login", {
    loginRequest: true
  });
});

//get request to preferences route
app.get("/preferences", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login"); //redirecting to login route
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  // finding user in the database through its ID
  User.findById(user_id, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      // rendering preferences.ejs file and passing some parameters along with it
      res.render("preferences", {
        prefList: foundUser.preferences
      });
    }
  });
});

//get request to general route
app.get("/general", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    // whatever written inside curly brackets are the parameters which I pass to my news.ejs file
    res.render("news", {
      allNews: news,
      clicked: "general",
      username: username,
      api: weatherApiKey
    });
  })()

});

//get request to news route
app.get("/news", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  console.log(user_id);

  User.findById(user_id, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      username = foundUser.name;

      if (foundUser.preferences.length === 1 && foundUser.preferences[0] === "") {
        res.redirect("/general");
      }

      (async () => {
        const len = foundUser.preferences.length;
        let news = [];

        for (i = 0; i < len; ++i) {
          const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=" + foundUser.preferences[i] + "&apiKey=" + process.env.NEWS_API_KEY;

          news = await getNews(api_url, news);
        }

        news = shuffle(news);
        res.render("news", {
          allNews: news,
          clicked: "my-reads",
          username: username,
          api: weatherApiKey
        });
      })()
    }
  });
});

//get request to sports route
app.get("/sports", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    res.render("news", {
      allNews: news,
      clicked: "sports",
      username: username,
      api: weatherApiKey
    });
  })()
});

//get request to entertainment route
app.get("/entertainment", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    res.render("news", {
      allNews: news,
      clicked: "entertainment",
      username: username,
      api: weatherApiKey
    });
  })()
});

//get request to health route
app.get("/health", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    res.render("news", {
      allNews: news,
      clicked: "health",
      username: username,
      api: weatherApiKey
    });
  })()
});

//get request to technology route
app.get("/technology", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    res.render("news", {
      allNews: news,
      clicked: "technology",
      username: username,
      api: weatherApiKey
    });
  })()
});

//get request to business route
app.get("/business", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    res.render("news", {
      allNews: news,
      clicked: "business",
      username: username,
      api: weatherApiKey
    });
  })()
});

//get request to science route
app.get("/science", function(req, res) {
  let user_id = "";
  if (req.cookies.userData) {
    user_id = req.cookies.userData;
  } else {
    res.redirect("/login");
  }

  if (user_id === "") {
    res.redirect("/login");
  }

  (async () => {
    let news = [];

    const api_url = "https://newsapi.org/v2/top-headlines?country=in&category=science&apiKey=" + process.env.NEWS_API_KEY;
    news = await getNews(api_url, news);

    res.render("news", {
      allNews: news,
      clicked: "science",
      username: username,
      api: weatherApiKey
    });
  })()
});

//get request to logout route
app.get("/logout", function(req, res) {
  res.cookie('userData', "", -1); //deleting session cookie of the  user
  res.render("logout");
});

//post request to register route
app.post("/register", function(req, res) {
  let email = req.body.email;

  //this is the method of verifying the format of email
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  //checking the format of email
  if (re.test(email) === false) {
    res.render("register", {
      correctEmailFormat: false,
      emailMatch: false,
      passwordMatch: true
    });
  } else {
    // check whether this email is already present in database or not
    User.findOne({email: req.body.email}, function(err, foundUser) {
      if (foundUser) {
        res.render("register", {
          correctEmailFormat: true,
          emailMatch: true,
          passwordMatch: true
        });
      }
      // check both passwords match with each other or not
      else if (req.body.pass !== req.body.re_pass) {
        res.render("register", {
          correctEmailFormat: true,
          emailMatch: false,
          passwordMatch: false
        });
      }
      // creating new entry in database
      else {
        bcrypt.hash(req.body.pass, saltRounds, function(err, hash) {

          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
          });

          newUser.save(function(err) {
            if (err) {
              console.log(err);
              res.redirect("/register");
            } else {
              // creating session cookie for this new user_id
              // here cookie stores in the form of key-value pair
              // here key is the "userData" and its value is the userID allocated to the new-user
              res.cookie("userData", newUser._id);
              res.redirect("/preferences");
            }
          });
        });
      }
    });
  }

});

//post request to login route
app.post("/login", function(req, res) {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.your_pass;

  // here in curly bracket, I have specified my condition that whether enteredUsername is matching with one of the email that I have stored in my database or not
  User.findOne({email: enteredEmail}, function(err, foundUser) {
    if (err || !foundUser) {
      console.log(err);
      res.render('login', {loginRequest: false});
    } else {
      if (foundUser) {
        // comparing entered password with the password stored in my database
        bcrypt.compare(enteredPassword, foundUser.password, function(err, result) {
          if (result === true) {
            res.cookie("userData", foundUser._id); //again generating session cookie for this logged-in user
            res.redirect("/news");
          } else {
            res.render("login", {loginRequest: false});
          }
        });
      }
    }
  });
});

//post request to preferences route
app.post("/preferences", function(req, res) {

  const user_id = req.cookies.userData;
  console.log(user_id);

  // method of converting string to array
  let str = req.body.prefList;
  delimiter = ","
  pref = str.split(delimiter);

  User.findByIdAndUpdate(user_id, {preferences: pref}, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/news"); //redirecting to news.ejs file
    }
  });
});

// Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the req.params object, with the name of the route parameter specified in the path as their respective keys.
// we able to use this route parameters just because of my EXPRESS module
// here newsTitle is dynamic in nature
// whenever user clicks on "Read full story" then it will randomly create new url as per title of news
app.post("/news/:newsTitle", function(req, res) {
  const newsObject = JSON.parse(req.body.newsObject);

  res.render("fullnews", {
    News: newsObject,
    username: username,
    api: weatherApiKey
  });
});

// listen website on a specific port
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
