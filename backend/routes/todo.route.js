//CRUD Operations for Todo
import express from "express";
import Todo from "../models/todo.model.js";

const router = express.Router();

//To get all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//To create a new todo
router.post("/", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//To update a todo
router.patch("/:id", async (req, res) => {
  try {
    const updateTodo = await Todo.findById(req.params.id);
    if (!updateTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (
      req.body.text !== undefined &&
      req.body.text !== null &&
      req.body.text !== ""
    ) {
      updateTodo.text = req.body.text;
    }
    if (req.body.completed !== undefined && req.body.completed !== null) {
      updateTodo.completed = req.body.completed;
    }
    await updateTodo.save();
    res.status(200).json(updateTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//To delete a todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
