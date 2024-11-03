const DB = require("../models");
const ResponseHelper = require("../utils/response");

class BookController {
  static async getAll(req, res) {
    try {
      const items = await DB.Book.find()
        .populate("categoryId", "name description")
        .populate("authorId", "name bio photoUrl");
      return ResponseHelper.success(res, items, "Successfully get all books");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Book.findById(req.params.id)
        .populate("categoryId", "name description")
        .populate("authorId", "name bio photoUrl");
      if (items == null)
        return ResponseHelper.error(res, "Book not found", 404);
      return ResponseHelper.success(res, items, "Successfully get book by id");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Book.create(req.body);
      return ResponseHelper.success(
        res,
        items,
        "Successfully create book",
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

      const items = await DB.Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (items == null)
        return ResponseHelper.error(res, "Book not found", 404);
      return ResponseHelper.success(res, items, "Successfully update book");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400);
      }
      const items = await DB.Book.findByIdAndDelete(req.params.id);
      if (items == null)
        return ResponseHelper.error(res, "Book not found", 404);
      return ResponseHelper.success(res, items, "Successfully delete book");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async uploadCover(req, res) {
    try {
      const items = await DB.Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (items == null)
        return ResponseHelper.error(res, "Book not found", 404);
      return ResponseHelper.success(res, items, "Successfully upload book url");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BookController;
