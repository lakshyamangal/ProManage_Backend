const Card = require("../models/card");
const User = require("../models/user");
const moment = require("moment");
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

const getSingleCard = async (cardID) => {
  try {
    const card = await Card.findById(cardID);
    if (!card) {
      throw new Error("Card not found");
    }

    return card;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const getAllCards = async (userId, duration) => {
  try {
    const currentDate = moment();
    const startTime = moment(currentDate).startOf(duration).valueOf();
    const endTime = moment(currentDate).endOf(duration).valueOf();

    const cards = await User.findById(userId).populate({
      // **Notes--> This is the name of the key in the user Schema //
      path: "cards",
      match: {
        createdAt: {
          $gte: new Date(parseInt(startTime)),
          $lte: new Date(parseInt(endTime)),
        },
      },
      options: { sort: { createdAt: 1 } },
    });
    const allCards = cards.cards;
    const cardsByStatus = {
      backlog: [],
      toDo: [],
      inProgress: [],
      done: [],
    };

    allCards.forEach((card) => {
      cardsByStatus[card.status].push(card);
    });
    return cardsByStatus;
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

    //**Notes-> when we state new to true it return the updated value , if not then by default it returns false , it is not necessary to write because you are not taking it anywhere ..//
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

const editCheckList = async (cardId, checkListId, isCompleted) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: { "checkList.$[elem].isCompleted": isCompleted } },
      { new: true, arrayFilters: [{ "elem._id": checkListId }] }
    );

    if (!updatedCard) {
      throw new Error("Card not found");
    }

    return updatedCard;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

const getCheckListCount = async (cardId) => {
  try {
    const card = await Card.findById(cardId);
    if (!card) throw new Error("Card Not Found");
    const totalChecklistItems = card.checkList.length;
    const completedChecklistItems = card.checkList.filter(
      (item) => item.isCompleted
    ).length;
    const data = { completedChecklistItems, totalChecklistItems };
    return data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

module.exports = {
  createCard,
  getSingleCard,
  getAllCards,
  deleteCard,
  changeStatus,
  editCard,
  editCheckList,
  getCheckListCount,
};
