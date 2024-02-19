const Card = require("../models/card");
const User = require("../models/user");
const mongoose = require("mongoose");

const getAnalytics = async (userId) => {
  try {
    const cards = await User.findById(userId).populate({
      path: "cards",
    });
    const allCards = cards.cards;
    const statistics = {
      priority: {
        low: 0,
        moderate: 0,
        high: 0,
      },
      status: {
        toDo: 0,
        inProgress: 0,
        backlog: 0,
        done: 0,
      },
      dueDate: 0,
    };

    allCards.forEach((card) => {
      // Count occurrences based on priority
      statistics.priority[card.priority]++;

      // Count occurrences based on status
      statistics.status[card.status]++;

      // Count occurrences of cards with dueDate not null and status not done
      if (card.dueDate && card.status !== "done") {
        statistics.dueDate++;
      }
    });

    return statistics;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
module.exports = { getAnalytics };
