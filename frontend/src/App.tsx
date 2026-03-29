import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";

interface TodoItem {
  _id?: string;
  text: string;
  completed: boolean;
}

const App = () => {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [form, setForm] = useState({
    text: "",
    completed: false,
  });
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  const startEditing = (todo: TodoItem) => {
    setEditingTodo(todo?._id ?? null);
    setEditedText(todo?.text);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const res = await axios.get("/api/todos");
        setTodoItems(res.data);
      } catch (error) {
        console.log("Error fetching todo items:", error);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form?.text?.trim() === "") return;
    try {
      const res = await axios.post("/api/todos", form);
      setTodoItems([...todoItems, res.data]);
      setForm({
        text: "",
        completed: false,
      });
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const saveEdit = async (id: string | undefined) => {
    try {
      const res = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodoItems(
        todoItems.map((item) => (item._id === id ? res.data : item)),
      );
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string | undefined) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodoItems(todoItems.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id: string | undefined) => {
    try {
      const todo = todoItems.find((item) => item._id === id);
      if (!todo) return;
      const res = await axios.patch(`/api/todos/${id}`, {
        text: todo?.text,
        completed: !todo.completed,
      });
      setTodoItems(
        todoItems?.map((item) => (item._id === id ? res.data : item)),
      );
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  return (
    <div
      id="TodoAppContainer"
      className="min-h-screen bg-gradient-to-br from gray-50-to-gray-100 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Task Manager
        </h1>
        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 p-1 rounded-lg"
        >
          <input
            type="text"
            value={form?.text}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                text: e.target.value,
              }));
            }}
            name="text"
            placeholder="Enter a new task"
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            required
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
            type="submit"
          >
            Add Task
          </button>
        </form>
        <div className="mt-4">
          {todoItems?.length === 0 ? (
            <div>No data found</div>
          ) : (
            <div className="flex flex-col gap-4">
              {todoItems?.map((item) => (
                <div key={item?._id}>
                  {editingTodo === item?._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                      />
                      <div className="flex gap-x-2">
                        <button
                          className="px-4 py-2 text-white rounded-lg hover:bg-green-600 bg-green-500 cursor-pointer"
                          onClick={() => saveEdit(item?._id)}
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-300 bg-gray-200 cursor-pointer"
                          onClick={() => setEditingTodo(null)}
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between gap-x-2">
                        <div className="flex gap-x-4 overflow-hidden">
                          <button
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${item?.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-500 cursor-pointer"}`}
                            onClick={() => toggleTodo(item?._id)}
                          >
                            {item?.completed && <MdOutlineDone />}
                          </button>
                          <span className="text-gray-800 font-medium truncate">
                            {item?.text}
                          </span>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200"
                            onClick={() => startEditing(item)}
                          >
                            <MdModeEditOutline />
                          </button>
                          <button
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200"
                            onClick={() => deleteTodo(item?._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
