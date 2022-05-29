const express=require("express")
const bodyParser=require("body-parser")
const https=require("https")
const mongoose=require("mongoose")
const User=require("./models/User")
const validator=require("validator")
const bcrypt=require("bcrypt")
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
require('dotenv').config();
const saltRounds=10

const path = require("path")

//app
const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());


console.log(path.join(__dirname ));
const static_path = path.join(__dirname);
app.use(express.static(static_path))

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
      //  const validPassword = bcrypt.compare(password, user.password);
       if (password!=user.password) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

//connect mongoDB:mongodb+srv://RedBack:<password>@cluster-redback.pa0yu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://RedBack:RedBack2022@cluster-redback.pa0yu.mongodb.net/testDatabase?retryWrites=true&w=majority", {useNewUrlParser: true})

//send value to MongoDB

app.post('/user',(req,res)=>{
    //const salt = bcrypt.genSaltSync(saltRounds);
    //const hash = bcrypt.hashSync(req.body.password, salt);
    const user=new User({
        username:req.body.username,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        password:req.body.password,
        redbackCoins:req.body.redbackCoins,
        telephone:req.body.telephone,
        userLevel:req.body.userLevel,
    });
    var followers = {
        username: req.body.followUser,
    };
    user.followers.push(followers);
    var following = {
        username: req.body.following,
    };
    user.following.push(following);
    user.save().catch((err) => console.log(err));

if (res.statusCode === 200)
        {
            console.log("Success send!");
        }
        else 
        {
            console.log("Something wrong?");
        }

})
app.post('/login', 
  passport.authenticate('local', { successRedirect: '/home.html',
  failureRedirect: '/register.html',
  session: false}),
  function(req, res) {
      
   
  });
app.get("/index",(req,res)=>{
    res.send("index");
});

app.get("/login",(req,res)=>{
    res.send("home");
    
});

app.get("/register",(req,res)=>{
    res.send("register");
});
app.get( '/user',(req, res)=>{
    User.find((err, list)=>{
            if (err) {res.send(err)}
            else {res.send(list)}
        })
    })
app.get('/user/:id', (req, res) => {
    User.findOne({_id: req.params.id}, (err, list)=>{
        if (list) (res.send(list))
        else res.send("Cannot find user id")
    })
})
app.delete('/user/:id',  (req, res) => {
    User.deleteOne({_id: req.params.id}, function(err, list) {
        if (err) {
          res.send("Cannot find user id");
        } else {
          res.send(list);
        }
      });
})
app.patch('/user/:id',(req, res)=>{
    User.update(
        {_id: req.params.id},
        {$set:{username: req.body.username,
            password: req.body.password,
            telephone : req.body.telephone,
            email: req.body.email,
            }},
        (err)=>{
            if (!err) {res.send('Successfully update a user')}
            else res.send(err)
        }
    )
})
//listen to 8080 port
//listen to 8080 port
app.listen(8080,function(req,res){
    console.log("Web server is running in 8080...");
})