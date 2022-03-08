const Todo = require("../model/todosModel");

const getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.status(200).json(todos);
};

const postTodos = async (req, res) => {
  console.log(req.body);
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add body");
  }
  const todos = await Todo.create({
    text: req.body.text,
  });
  res.status(200).json(todos);
};

const putTodos = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  console.log(req.params.id);

  if (!todo) {
    res.status(400);
    throw new Error("todo not found");
  }
  console.log(req.params.id);
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedTodo);
};

const deleteTodos = async (req, res) => {
  res.status(200).json({ message: `delete to do ${req.params.id}` });
};
module.exports = {
  getTodos,
  postTodos,
  putTodos,
  deleteTodos,
};
