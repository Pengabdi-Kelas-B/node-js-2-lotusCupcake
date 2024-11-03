const DB = require("../models");
const ResponseHelper = require("../utils/response");

class BookStockController {
  static async getAll(req, res) {
    try {
      const items = await DB.BookStock.find().populate("bookId", "title isbn");
      return ResponseHelper.success(
        res,
        items,
        "Successfully get all book stocks"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getByBookId(req, res) {
    try {
      const stock = await DB.BookStock.findOne({
        bookId: req.params.bookId,
      }).populate("bookId", "title isbn");

      if (!stock) {
        return ResponseHelper.error(res, "Book stock not found", 404);
      }

      return ResponseHelper.success(res, stock, "Successfully get book stock");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const { bookId, totalQuantity, performedBy } = req.body;

      const book = await DB.Book.findById(bookId);
      if (!book) {
        return ResponseHelper.error(res, "Book not found", 404);
      }

      const existingStock = await DB.BookStock.findOne({ bookId });
      if (existingStock) {
        return ResponseHelper.error(
          res,
          "Stock for this book already exists",
          400
        );
      }

      const stock = await DB.BookStock.create({
        bookId,
        totalQuantity,
        availableQuantity: totalQuantity,
        borrowedQuantity: 0,
      });

      await DB.StockLog.create({
        bookId,
        type: "IN",
        quantity: totalQuantity,
        previousTotal: 0,
        currentTotal: totalQuantity,
        previousAvailable: 0,
        currentAvailable: totalQuantity,
        previousBorrowed: 0,
        currentBorrowed: 0,
        reason: "Initial stock creation",
        performedBy: performedBy || "SYSTEM",
      });

      return ResponseHelper.success(
        res,
        stock,
        "Successfully created book stock",
        201
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async adjustStock(req, res) {
    try {
      const { bookId } = req.params;
      const { adjustment, reason, performedBy } = req.body;

      const stock = await DB.BookStock.findOne({ bookId });
      if (!stock) {
        return ResponseHelper.error(res, "Book stock not found", 404);
      }

      const previousTotal = stock.totalQuantity;
      const newTotal = previousTotal + adjustment;
      const previousAvailable = stock.availableQuantity;
      const newAvailable = previousAvailable + adjustment;
      const previousBorrowed = stock.borrowedQuantity;

      if (newTotal < previousBorrowed) {
        return ResponseHelper.error(
          res,
          "Cannot reduce stock below borrowed quantity",
          400
        );
      }

      stock.totalQuantity = newTotal;
      stock.availableQuantity = newAvailable;
      stock.lastUpdated = new Date();
      await stock.save();

      await DB.StockLog.create({
        bookId,
        type: adjustment > 0 ? "IN" : "OUT",
        quantity: Math.abs(adjustment),
        previousTotal,
        currentTotal: newTotal,
        previousAvailable,
        currentAvailable: newAvailable,
        previousBorrowed,
        currentBorrowed: previousBorrowed,
        reason,
        performedBy,
      });

      return ResponseHelper.success(res, stock, "Successfully adjusted stock");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getStockLogs(req, res) {
    try {
      let filter = {};
      if (req.query.bookId) {
        filter.bookId = req.query.bookId;
      }
      const logs = await DB.StockLog.find(filter)
        .sort({ createdAt: -1 })
        .populate("bookId", "title isbn")
        .populate("borrowingId", "borrowDate returnDate");

      return ResponseHelper.success(
        res,
        logs,
        "Successfully retrieved stock logs"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BookStockController;
