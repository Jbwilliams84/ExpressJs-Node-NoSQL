var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});


//where we send the posts to should be the same route as the list, i.e campgrounds
router.post("/", middleware.isLoggedIn, (req, res) => {
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var desc = req.body.description;
	var newCampground = {name: name, price: price, image: image, description: desc, author:author};
	//Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		res.redirect('/campgrounds');
	});
});


//SHOW PAGE
router.get("/:id", (req, res) => {
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground:foundCampground});
		}
	});
});

//	EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
		
		Campground.findById(req.params.id, (err, foundCampground) => {
			res.render("campgrounds/edit", {campground: foundCampground});
		});	 
	});
		

// 	UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			//redirect somewhere
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});


//	DESTROY CAMPGROUND ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// router.delete("/:id", checkCampgroundOwnership, (req, res) => {
//     Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
//         if (err) {
//             console.log(err);
//         }
//         Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
//             if (err) {
//                 console.log(err);
//             }
//             res.redirect("/campgrounds");
//         });
//     });
// });



module.exports = router;