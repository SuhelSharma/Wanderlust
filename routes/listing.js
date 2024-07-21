const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single("listing[image][url]"),
         wrapAsync(listingController.createRoute));

// New Route: form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showRoute))
    .put(isLoggedIn, isOwner,
        upload.single("listing[image][url]"),
          wrapAsync(listingController.updateRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));

// Edit Route: form to edit an existing listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));

module.exports = router;
