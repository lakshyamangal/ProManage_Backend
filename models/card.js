const mongoose = require("mongoose");
const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["toDo", "inProgress", "backlog", "done"],
      default: "toDo",
    },
    checkList: [
      {
        title: String,
        isCompleted: Boolean,
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);
module.exports = mongoose.model("Card", cardSchema);
