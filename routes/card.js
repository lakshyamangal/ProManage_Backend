const express = require("express");
const router = express.Router();
const { check, body, param } = require("express-validator");
const { validateRequest } = require("../middlewares/requestValidator");
const verifyJwt = require("../middlewares/authMiddleware");
const {
  createCard,
  getSingleCard,
  getAllCards,
  deleteCard,
  changeStatus,
  editCard,
  editCheckList,
  getCheckListCount,
} = require("../controllers/card");
const validateUnixTimestamp = require("../utils/validateUnixTimeStamp");

router.post(
  "/createCard",
  verifyJwt,
  [
    check("title")
      .notEmpty()
      .withMessage("Title is a required field")
      .isString()
      .withMessage("Title must be a String")
      .trim(),
    check("priority", "priority is a required field")
      .isIn(["low", "moderate", "high"])
      .withMessage("invalid priority type"),
    check("checkList")
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
      res.send({ success: true, data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: false, data: err.message });
    }
  }
);

router.get(
  "/getSingleCard/:cardId",
  [
    param("cardId", "card Id needed").isMongoId(
      "CardId should be a valid mongoDb Id"
    ),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const cardId = req.params.cardId;
      const data = await getSingleCard(cardId);
      res.send({ success: true, data: data });
    } catch (err) {
      res.send({ success: false, data: err.message });
    }
  }
);

router.get(
  "/getAllCards/:duration",
  verifyJwt,
  [
    param("duration")
      .isIn(["day", "week", "month"])
      .withMessage("invalid duration type"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.body.userId;
      const { duration } = req.params;
      const data = await getAllCards(userId, duration);
      res.send({ success: true, data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: false, data: err.message });
    }
  }
);

router.put(
  "/editCard",
  verifyJwt,
  [
    check("cardId", "card Id needed").isMongoId(
      "CardId should be a valid mongoDb Id"
    ),
    check("title")
      .notEmpty()
      .withMessage("Title is a required field")
      .isString()
      .withMessage("Title must be a String")
      .trim(),
    check("priority", "priority is a required field")
      .isIn(["low", "moderate", "high"])
      .withMessage("invalid priority type"),
    check("checkList")
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
      const { cardId, title, priority, checkList } = req.body;
      const dueDate = req.body.dueDate || null;
      console.log(cardId, title, priority, checkList, dueDate);
      const data = await editCard(cardId, title, priority, checkList, dueDate);
      res.send({ success: true, data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: false, data: err.message });
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
      res.send({ success: true, data: "card Deleted successfully" });
    } catch (err) {
      //err contains a object of error class , it contians a name which is a string that is error type and message that contains string that states the error . , to string converts both into string and give
      // error in this format name:message //
      res.send({ success: false, data: err.message });
    }
  }
);

router.put(
  "/changeStatus",
  verifyJwt,
  [
    check("cardId", "card Id needed").isMongoId(
      "CardId should be a valid mongoDb Id"
    ),
    check("status")
      .isIn(["toDo", "inProgress", "backlog", "done"])
      .withMessage("Invalid Status type"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { cardId, status } = req.body;
      const data = await changeStatus(cardId, status);
      res.send({ success: true, data: data });
    } catch (err) {
      res.send({ success: false, data: err.message });
    }
  }
);

router.put(
  "/editCheckList",
  verifyJwt,
  [
    check("cardId", "card Id needed").isMongoId(
      "CardId should be a valid mongoDb Id"
    ),
    check("checkListId", "checkList id needed").isMongoId(
      "checkListId should be a valid mongoDb Id"
    ),
    check("isCompleted").isBoolean("isCompleted should be a boolean"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { cardId, checkListId, isCompleted } = req.body;

      const data = await editCheckList(cardId, checkListId, isCompleted);
      res.send({ success: true, data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: false, data: err.message });
    }
  }
);

router.get(
  "/getCheckListCount/:cardId",
  [
    param("cardId", "card Id needed").isMongoId(
      "CardId should be a valid mongoDb Id"
    ),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { cardId } = req.params;
      const data = await getCheckListCount(cardId);
      res.send({ success: true, data: data });
    } catch (err) {
      console.log(err);
      res.send({ success: false, data: err.message });
    }
  }
);

module.exports = router;
