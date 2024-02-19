const Card = require("../models/card");
const User = require("../models/user");
const mongoose = require("mongoose");

const createCard = async (userId, title, priority, checkList, dueDate) => {
  try {
    const cardDetails = new Card({
      userId,
      title,
      priority,
      checkList,
      dueDate,
    });
    const savedCard = await cardDetails.save();
    const cardId = savedCard._id;
    await User.findByIdAndUpdate(userId, { $push: { cards: cardId } });
    const data = "Card created successfully!!";
    return data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const getAllCards = async (userId, startTime, endTime) => {
  try {
    const cards = await User.findById(userId).populate({
      // **Notes--> This is the name of the key in the user Schema //
      path: "cards",
      match: {
        createdAt: {
          $gte: new Date(parseInt(startTime)),
          $lte: new Date(parseInt(endTime)),
        },
      },
    });
    return cards;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const editCard = async (cardId, title, priority, checkList, dueDate) => {
  try {
    const card = await Card.findById(cardId);
    if (!card) throw new Error("Card Not Found");
    await Card.findByIdAndUpdate(cardId, {
      $set: {
        cardId,
        title,
        priority,
        checkList,
        dueDate,
      },
    });
    const data = "Card updatated successfully!!";
    return data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const deleteCard = async (cardId, userId) => {
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new Error("Card not found");
    }

    //**Notes-> when we state new to true it return the updated value , if not then by default it returns false//
    await User.findByIdAndUpdate(
      userId,
      { $pull: { cards: cardId } },
      { new: true }
    );
    await Card.findByIdAndDelete(cardId);
    return;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const changeStatus = async (cardId, status) => {
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new Error("Card Not Found");
    }
    await Card.findByIdAndUpdate(cardId, {
      $set: {
        status,
      },
    });
    const data = "Card Status updated succesfully";
    return data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  changeStatus,
  editCard,
};
