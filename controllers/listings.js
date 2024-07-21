const axios = require('axios');
const Listing = require("../models/listing.js");

const MAPTILER_API_KEY = process.env.MAP_TOKEN;

// Function to geocode an address using MapTiler (forward geocoding)
async function geocodeAddress(address, biasLocation = null) {
  let url = `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${MAPTILER_API_KEY}`;
  if (biasLocation) {
    url += `&proximity=${biasLocation.longitude},${biasLocation.latitude}`;
  }
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`Request failed with status code ${response.status}`);
  }
  const coordinates = response.data.features[0].geometry.coordinates;
  return coordinates;
}

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to fetch listings. Please try again.");
    res.redirect("/"); // Redirect to home or appropriate page
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showRoute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to fetch listing details. Please try again.");
    res.redirect("/listings");
  }
};

module.exports.createRoute = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  try {
    // Geocode address
    const address = req.body.listing.location;
    const [longitude, latitude] = await geocodeAddress(address);
    newListing.geometry = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to geocode address. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.editRoute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to fetch listing details for editing. Please try again.");
    res.redirect("/listings");
  }
};

module.exports.updateRoute = async (req, res, next) => {
  let { id } = req.params;
  try {
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
  
    // Geocode address if location is updated
    if (req.body.listing.location) {
      const address = req.body.listing.location;
      const [longitude, latitude] = await geocodeAddress(address);
      listing.geometry = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      await listing.save();
    }
  
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.deleteRoute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to delete listing. Please try again.");
    res.redirect("/listings");
  }
};
