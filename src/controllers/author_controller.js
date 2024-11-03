const DB = require("../models");
const ResponseHelper = require("../utils/response");

class AuthorController {
  static async getAll(req, res) {
    try {
      const items = await DB.Author.find().populate(
        "books",
        "title description"
      );
      return ResponseHelper.success(res, items, "Successfully get all authors");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Author.findById(req.params.id).populate(
        "books",
        "title description"
      );
      if (items == null)
        return ResponseHelper.error(res, "Author not found", 404);
      return ResponseHelper.success(
        res,
        items,
        "Successfully get author by id"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Author.create(req.body);
      return ResponseHelper.success(
        res,
        items,
        "Successfully create author",
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

      const items = await DB.Author.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (items == null)
        return ResponseHelper.error(res, "Author not found", 404);
      return ResponseHelper.success(res, items, "Successfully update author");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400);
      }

      const items = await DB.Author.findByIdAndDelete(req.params.id);
      if (items == null)
        return ResponseHelper.error(res, "Author not found", 404);
      return ResponseHelper.success(res, items, "Successfully delete author");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async uploadPhoto(req, res) {
    try {
      const items = await DB.Author.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (items == null)
        return ResponseHelper.error(res, "Author not found", 404);
      return ResponseHelper.success(
        res,
        items,
        "Successfully upload author photo url"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = AuthorController;
