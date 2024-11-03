const express = require("express");
var cors = require("cors");
const testRoutes = require("./test_routes");
const categoryRouter = require("./category_routes");
const bookRouter = require("./book_routes");
const authorRouter = require("./author_routes");
const borrowerRouter = require("./borrower_routes");
const borrowingRouter = require("./borrowing_routes");
const bookStockRouter = require("./bookStock_routes");

const routes = express.Router();

routes.use(cors());

routes.use(testRoutes);
routes.use(categoryRouter);
routes.use(bookRouter);
routes.use(authorRouter);
routes.use(borrowerRouter);
routes.use(borrowingRouter);
routes.use(bookStockRouter);

module.exports = routes;
