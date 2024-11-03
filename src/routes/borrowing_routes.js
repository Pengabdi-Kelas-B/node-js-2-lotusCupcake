const express = require("express");
const BorrowingController = require("../controllers/borrowing_controller");

const borrowingRouter = express.Router();

borrowingRouter.get("/borrowings", BorrowingController.getAll);
borrowingRouter.post("/borrowing", BorrowingController.create);
borrowingRouter.post("/borrowing/return", BorrowingController.return);

module.exports = borrowingRouter;
