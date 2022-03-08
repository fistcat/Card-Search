const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
