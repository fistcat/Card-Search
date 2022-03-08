const express = require("express");
const route = express.Router();
const {
  getTodos,
  postTodos,
  putTodos,
  deleteTodos,
} = require("../controller/todosController");

route.route("/").get(getTodos).post(postTodos);
route.report("/:id").put(putTodos).delete(deleteTodos);

module.exports = route;
