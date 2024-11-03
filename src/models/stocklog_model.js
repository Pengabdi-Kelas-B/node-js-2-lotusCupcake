const mongoose = require("mongoose");

const StockLogSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousTotal: {
      type: Number,
      required: true,
    },
    currentTotal: {
      type: Number,
      required: true,
    },
    previousAvailable: {
      type: Number,
      required: true,
    },
    currentAvailable: {
      type: Number,
      required: true,
    },
    previousBorrowed: {
      type: Number,
      required: true,
    },
    currentBorrowed: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    borrowingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrowing",
      default: null,
    },
    performedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = StockLogSchema;
