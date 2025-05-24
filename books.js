const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishedYear: Number,
  genres: [String],
  language: String,
  country: String,
  rating: Number,
  summary: String,
  coverImageUrl: String
});

module.exports = mongoose.model("Book", bookSchema);

