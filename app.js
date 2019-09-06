var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
 	mongoose 			= require("mongoose"),
	passport			= require("passport"),
	User				= require("./models/user"),
	LocalStrategy		= require("passport-local").Strategy,
	methodOverride		= require("method-override"),
	Campground 			= require("./models/campground"),
	Comment 			= require("./models/comment.js"),
	flash 				= require("connect-flash"),
	seedDB 				= require("./seeds");


var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	authRoutes 			= require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR: ", err.message);
});



app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
// seedDB();
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again, dont mess with my hotdogs",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


// //SCHEMA SETUP

// // Campground.create({name: "Granite Hill", image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg", description: "This is a huge Granite Hill, no bathrooms, no water, but pretty rocks"},
		
// // 	function(err, campground){
// // 		if(err){
// // 			console.log(err);
// // 		} else {
// // 			console.log("Newly Created Campground");
// // 			console.log(campground);
// // 		}
// // });

app.get("/", (req, res) => {
	res.render("landing");
});

// app.get("/campgrounds", (req, res) => {
// 		//Get all campgrounds from DB
// 	Campground.find({}, function(err, allCampgrounds){
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
// 		}
// 	});
// });


// //NEW - show form to create new campground
// app.get("/campgrounds/new", function(req, res) {
// 	res.render("campgrounds/new");
// });


// //where we send the posts to should be the same route as the list, i.e campgrounds
// app.post("/campgrounds", (req, res) => {
// 	//get data from form and add to campgrounds array
// 	var name = req.body.name;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var newCampground = {name: name, image: image, description: desc};
// 	//Create a new campground and save to DB
// 	Campground.create(newCampground, function(err, newlyCreated){
// 		res.redirect('/campgrounds');
// 	});
// });


// //SHOW PAGE
// app.get("/campgrounds/:id", (req, res) => {
// 	//find the campground with provided ID
// 	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			console.log(foundCampground);
// 			res.render("campgrounds/show", {campground:foundCampground});
// 		}
// 	});
// });

// //====================================

// //COMMENTS ROUTES

// //====================================

// app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
// 	//find campground by id
// 	Campground.findById(req.params.id, function(err, campground) {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("comments/new", {campground:campground});
// 		}
// 	});
// });

// app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
// 	//lookup campground using ID
// 	Campground.findById(req.params.id, function(err, campground) {
// 		if(err){
// 			console.log(err);
// 			res.redirect("/campgrounds");
// 		} else {
// 			Comment.create(req.body.comment, function(err, comment){
// 				if(err) {
// 					console.log(err);
// 				} else {
// 					campground.comments.push(comment);
// 					campground.save();
// 					res.redirect("/campgrounds/" + campground._id);
// 				}
// 			});
// 		}
// 	});
// 	//create new comment
// 	//connect new comment to campground
// 	//redirect to campground show page
// });



// //AUTHENTICATION ROUTES

// //show register form
// app.get("/register", (req, res) => {
// 	res.render("register");
// });

// //sign up logic
// app.post("/register", (req, res) => {
// 	var newUser = new User({username: req.body.username});
// 	User.register(newUser, req.body.password, function(err,user){
// 		if(err) {
// 			console.log(err);
// 			return res.render("register");
// 		}
// 		passport.authenticate("local")(req, res, function() {
// 			res.redirect("/campgrounds");
// 		});
// 	});
// });


// //show login form
// app.get("/login", (req, res) => {
// 	res.render("login");
// });

// app.post("/login",passport.authenticate("local", {
// 	successRedirect: "/campgrounds",
// 	failureRedirect: "/login"
// }), (req, res) => {});

// //logout route
// app.get("/logout", (req, res) => {
// 	req.logout();
// 	res.redirect("/campgrounds");
// });

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	} 
// 	res.redirect("/login");
// }

app.listen('3000', () => {
	console.log("YelpCamp Server Has Started");
});





// RESTFUL ROUTES

// name		   url   	       verb 		          description
// =======================================================================================
// INDEX      /dogs	        	GET  	  Displays a list of all dogs
// NEW		  /dogs/new     	GET       Displays our form
// CREATE     /dogs             POST      Posts new item to DB
// SHOW       /dogs/:id         GET       Shows info about one dog
// EDIT		  /dogs/:id/:edit   GET       Show edit form for one dog
// UPDATE     /dogs/:id         PUT       Update a particular dog, then redirect somewhere
// DESTROY    /dogs/:id         DELETE    Delete a particular dog, then redirect somewhere
