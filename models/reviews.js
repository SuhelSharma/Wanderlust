const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("review", reviewSchema);
