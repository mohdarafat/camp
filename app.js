var express = require("express");
 app = express();
 bodyparser= require("body-parser");
 mongoose = require("mongoose");
 passport=require("passport"),
 LocalStrategy=require("passport-local"),
 User    = require("./models/user"),
 mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyparser.urlencoded({extended :true}));
app.set("view engine","ejs");


//creating campground
var campgroundSchema = new mongoose.Schema({
    name: String,
    image:String,
    description:String
});

///passport configuration
app.use(require("express-session")({
    secret:"once again you are here",
    resave:false,
    saveUninitialized :false,
}));
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());








var campground = mongoose.model("Campground",campgroundSchema);

 campground.create({
     name:"captureEvents",
     image:"",
     description:"hey fizaZA"
    
    },
     function(err,campground) {
         if(err){
             console.log(err);
         }else{
             console.log("newly created");
             console.log(campground);
         }
     });
 
 app.get("/",function(req,res){
     res.render("landing");
 });
app.get("/campgrounds",function(req,res){

campground.find({},function(err,allCampgrounds) {
    if(err){
        console.log(err);
    }else{
        res.render("campgrounds",{campgrounds:allCampgrounds});
    }
});
});
 app.post("/campgrounds",function(req,res){
     // get the data from from and send to campground
   var name=req.body.name;
     var image = req.body.image;
     var desc = req.body.description;
     var newcampground={name:name,image:image,description:desc}
    campground.create(newcampground,function (newlycreated,err){
        if(err){
            console.log(err);

        }else{
            res.redirect("/allCampgrounds");
        }
    })
 });

app.get("/campgrounds/new",isLoggedIn,function(req,res){
   
    res.render('new.ejs');
});

app.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id, function(err,campgroundfound) {
        if(err)
        {

        }else{
        res.render("show",{campground : campgroundfound});
        }
    })
 
});
///signup

app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
  
 var newUser=new User({username:req.body.username});
 User.register(newUser,req.body.password,function(err,user){

    if(err){
        console.log(err);
        return res.render("register");
    }else
     passport.authenticate("local")(req,res,function(){
         res.redirect("/campgrounds");
     });
     
 });



});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect :"/campgrounds",
    failureRedirect  :"/login"
}),function(req,res){


});

//logout

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

//authentication

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(80,function(){
    console.log("its working!!");
});


