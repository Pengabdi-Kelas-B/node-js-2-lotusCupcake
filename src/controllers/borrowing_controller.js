const DB = require("../models");
const ResponseHelper = require("../utils/response");

class BorrowingController {
  static async getAll(req, res) {
    try {
      const filter = {};
      if (req.query.status) {
        filter.status = req.query.status;
      }

      const items = await DB.Borrowing.find(filter)
        .populate("bookId", "title description")
        .populate("borrowerId", "membershipId name");
      return ResponseHelper.success(
        res,
        items,
        "Successfully get all borrowings"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Borrowing.findById(req.params.id);
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const book = await DB.Book.findById(req.body.bookId);
      const borrower = await DB.Borrower.findById(req.body.borrowerId);
      const stock = await DB.BookStock.findOne({
        bookId: req.body.bookId,
      });

      if (!book || !borrower) {
        return ResponseHelper.error(res, "Book or Borrower not found!", 400);
      }

      if (!stock) {
        return ResponseHelper.error(res, "Book stock not found!", 400);
      }

      if (stock.availableQuantity < 1) {
        return ResponseHelper.error(
          res,
          "Book is not available for borrowing",
          400
        );
      }

      const createdData = await DB.Borrowing.create(req.body);
      borrower.borrowHistory.push(createdData._id);
      await borrower.save();

      const previousAvailable = stock.availableQuantity;
      const previousBorrowed = stock.borrowedQuantity;

      stock.availableQuantity -= 1;
      stock.borrowedQuantity += 1;
      stock.lastUpdated = new Date();
      await stock.save();

      await DB.StockLog.create({
        bookId: book._id,
        type: "OUT",
        quantity: 1,
        previousTotal: stock.totalQuantity,
        currentTotal: stock.totalQuantity,
        previousAvailable,
        currentAvailable: stock.availableQuantity,
        previousBorrowed,
        currentBorrowed: stock.borrowedQuantity,
        reason: `Borrowed by ${borrower.name}`,
        borrowingId: createdData._id,
        performedBy: "SYSTEM",
      });

      return ResponseHelper.success(
        res,
        createdData,
        "Successfully created borrowing",
        201
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async return(req, res) {
    try {
      const { bookId, borrowerId } = req.body;
      const borrowing = await DB.Borrowing.findOne({
        bookId: bookId,
        borrowerId: borrowerId,
      }).populate("borrowerId", "name");
      if (borrowing.length < 1) {
        return ResponseHelper.error(res, "Borrowing record not found", 404);
      }

      if (borrowing.status === "RETURNED") {
        return ResponseHelper.error(res, "Book already returned", 400);
      }

      const DAILY_LATE_FEE = 5000;
      const currentDate = new Date();
      const dueDate = new Date(borrowing.dueDate);
      let lateFee = 0;

      if (currentDate > dueDate) {
        const diffTime = Math.abs(currentDate - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        lateFee = diffDays * DAILY_LATE_FEE;
      }

      const stock = await DB.BookStock.findOne({
        bookId: bookId,
      });

      if (!stock) {
        return ResponseHelper.error(res, "Book stock not found", 404);
      }

      const previousAvailable = stock.availableQuantity;
      const previousBorrowed = stock.borrowedQuantity;

      borrowing.returnDate = currentDate;
      borrowing.status = "RETURNED";
      borrowing.lateFee = lateFee;
      await borrowing.save();

      stock.availableQuantity += 1;
      stock.borrowedQuantity -= 1;
      stock.lastUpdated = currentDate;
      await stock.save();

      await DB.StockLog.create({
        bookId: borrowing.bookId,
        type: "IN",
        quantity: 1,
        previousTotal: stock.totalQuantity,
        currentTotal: stock.totalQuantity,
        previousAvailable,
        currentAvailable: stock.availableQuantity,
        previousBorrowed,
        currentBorrowed: stock.borrowedQuantity,
        reason: `Returned by ${borrowing.borrowerId.name}`,
        borrowingId: borrowing._id,
        performedBy: "SYSTEM",
      });

      const response = {
        ...borrowing.toObject(),
        lateFee,
        daysLate:
          lateFee > 0
            ? Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24))
            : 0,
      };

      return ResponseHelper.success(
        res,
        response,
        `Successfully returned book${
          lateFee > 0 ? `. Late fee: ${lateFee}` : ""
        }`
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BorrowingController;
