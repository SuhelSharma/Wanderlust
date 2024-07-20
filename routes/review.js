const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from the parent router
const wrapAsync = require("../utils/wrapAsync.js");
const{validateReview, isLoggedIn, isReviewAuthor}   = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



// Post review Route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
