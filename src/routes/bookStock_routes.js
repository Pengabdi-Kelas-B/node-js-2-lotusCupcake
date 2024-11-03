const express = require("express");
const BookStockController = require("../controllers/bookStock_controller");

const bookStockRouter = express.Router();

bookStockRouter.get("/bookStocks", BookStockController.getAll);
bookStockRouter.post("/bookStock", BookStockController.create);
bookStockRouter.post(
  "/bookStock/adjust/:bookId",
  BookStockController.adjustStock
);
bookStockRouter.get("/bookStock/logs", BookStockController.getStockLogs);
bookStockRouter.get("/bookStock/:bookId", BookStockController.getByBookId);

module.exports = bookStockRouter;
