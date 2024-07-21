const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema, reviewSchema } = require("./Schema.js");


// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store originalUrl in session
        req.flash("error", "You must be logged in to access this page!");
        return res.redirect("/login"); // Redirect to login page
    }
    res.locals.currUser = req.user; 
    next(); // Proceed to the next middleware or route handler
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make redirectUrl available in locals
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
let { id } = req.params;
let listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
  req.flash("error", "You are not the owner of this listing");
  return res.redirect(`/listings/${id}`);
}
next();
};

module.exports. validateListing = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  
  // for validate review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  module.exports.isReviewAuthor = async(req, res, next) => {
    let { reviewId, id } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the author of this Review");
      return res.redirect(`/listings/${id}`);
    }
    next();
    };