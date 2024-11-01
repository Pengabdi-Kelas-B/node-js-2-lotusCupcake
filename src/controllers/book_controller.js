const DB = require("../models");
const ResponseHelper = require("../utils/response");

class BookController {
  static async getAll(req, res) {
    try {
      const items = await DB.Book.find();
      return ResponseHelper.success(res, items, "sukses mengambil data buku");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Book.findById(req.params.id)
        .populate("categoryId", "name description")
        .populate("authorId");
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Book.create(req.body);
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async update(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400);
      }

      const items = await DB.Book.findByIdAndUpdate(req.params.id, req.body);
      return ResponseHelper.success(res, items);
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
      return ResponseHelper.success(res, items);
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = BookController;
