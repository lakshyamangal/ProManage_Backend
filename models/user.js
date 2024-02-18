const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      //this refers to the model Card and is used to populate when required //
      ref: "Card",
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
