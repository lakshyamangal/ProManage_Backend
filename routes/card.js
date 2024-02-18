const express = require("express");
const router = express.Router();
const { check, body, param } = require("express-validator");
const { validateRequest } = require("../middlewares/requestValidator");
const verifyJwt = require("../middlewares/authMiddleware");
const { createCard, getAllCards, deleteCard } = require("../controllers/card");
const validateUnixTimestamp = require("../utils/validateUnixTimeStamp");
const card = require("../models/card");

router.post(
  "/createCard",
  verifyJwt,
  [
    check("title", "Title is a required field").isString(),
    check("priority", "priority is a required field")
      .isIn(["low", "moderate", "high"])
      .withMessage("invalid priority type"),
    check("checklist")
      .isArray()
      .custom((value) => {
        if (value.length > 0) {
          return true;
        }
        throw new Error("CheckList must contain atleast 1 element");
      }),
    check("dueDate").optional(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { userId, title, priority, checkList } = req.body;
      const dueDate = req.body.dueDate || null;
      const data = await createCard(
        userId,
        title,
        priority,
        checkList,
        dueDate
      );
      res.send({ success: "true", data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: "false", data: err.toString() });
    }
  }
);

router.get(
  "/getAllCards/:startTime/:endTime",
  verifyJwt,
  [
    param("startTime").custom(validateUnixTimestamp),
    param("endTime").custom(validateUnixTimestamp),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const { startTime, endTime } = req.params;
      const data = await getAllCards(userId, startTime, endTime);
      res.send({ success: "true", data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: "false", data: err.toString() });
    }
  }
);
router.delete(
  "/deleteCard/:cardId",
  verifyJwt,
  [
    param("cardId", "card Id needed").isMongoId(
      "CardId should be a valid mongoDb Id"
    ),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const cardId = req.params.cardId;
      await deleteCard(cardId, userId);
      res.send({ success: "true", data: "card Deleted successfully" });
    } catch (err) {
      res.send({ success: "false", data: err.toString() });
    }
  }
);
module.exports = router;
