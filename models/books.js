const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  published: {
    type: Number,
  },
  author: {
    type: String,
    minlength: 5,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
})

module.exports = mongoose.model("Book", schema)
