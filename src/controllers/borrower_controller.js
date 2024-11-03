const DB = require("../models");
const ResponseHelper = require("../utils/response");

class BorrowerController {
  static async getAll(req, res) {
    try {
      const items = await DB.Borrower.find().populate({
        path: "borrowHistory",
        select: "bookId borrowDate dueDate returnDate lateFee status",
        populate: {
          path: "bookId",
          select: "title description",
        },
      });
      return ResponseHelper.success(
        res,
        items,
        "Successfully get all borrowers"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Borrower.findById(req.params.id).populate({
        path: "borrowHistory",
        select: "bookId borrowDate dueDate returnDate lateFee status",
        populate: {
          path: "bookId",
          select: "title description",
        },
      });
      if (items == null)
        return ResponseHelper.error(res, "Borrower not found", 404);
      return ResponseHelper.success(
        res,
        items,
        "Successfully get borrower by id"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const latestBorrower = await DB.Borrower.findOne().sort({
        membershipId: -1,
      });

      let nextNumber = 1;
      if (latestBorrower) {
        const currentNumber = parseInt(latestBorrower.membershipId.slice(3));
        nextNumber = currentNumber + 1;
      }
      const membershipId = `MEM${nextNumber.toString().padStart(3, "0")}`;
      const borrowerData = {
        ...req.body,
        membershipId: membershipId,
      };
      console.log(borrowerData);
      const items = await DB.Borrower.create(borrowerData);

      return ResponseHelper.success(
        res,
        items,
        "Successfully create borrower",
        201
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async update(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400);
      }

      const items = await DB.Borrower.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (items == null)
        return ResponseHelper.error(res, "Borrower not found", 404);
      return ResponseHelper.success(res, items, "Successfully update borrower");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400);
      }

      const items = await DB.Borrower.findByIdAndDelete(req.params.id);
      if (items == null)
        return ResponseHelper.error(res, "Borrower not found", 404);
      return ResponseHelper.success(res, items, "Successfully delete borrower");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async uploadPhoto(req, res) {
    try {
      const items = await DB.Borrower.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (items == null)
        return ResponseHelper.error(res, "Borrower not found", 404);
      return ResponseHelper.success(
        res,
        items,
        "Successfully upload borrower photo url"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BorrowerController;
