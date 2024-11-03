const DB = require("../models");
const ResponseHelper = require("../utils/response");

class CategoryController {
  static async getAll(req, res) {
    try {
      const items = await DB.Category.find();
      return ResponseHelper.success(
        res,
        items,
        "Successfully get all categories"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getById(req, res) {
    try {
      const items = await DB.Category.findById(req.params.id);
      if (items == null)
        return ResponseHelper.error(res, "Category not found", 404);
      return ResponseHelper.success(
        res,
        items,
        "Successfully get category by id"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async create(req, res) {
    try {
      const items = await DB.Category.create(req.body);
      return ResponseHelper.success(
        res,
        items,
        "Successfully create category",
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

      const items = await DB.Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (items == null)
        return ResponseHelper.error(res, "Category not found", 404);
      return ResponseHelper.success(res, items, "Successfully update category");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async delete(req, res) {
    try {
      if (!req.params.id) {
        return ResponseHelper.error(res, "ID not provided!", 400);
      }

      const items = await DB.Category.findByIdAndDelete(req.params.id);
      if (items == null)
        return ResponseHelper.error(res, "Category not found", 404);
      return ResponseHelper.success(res, items, "Successfully delete category");
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = CategoryController;
