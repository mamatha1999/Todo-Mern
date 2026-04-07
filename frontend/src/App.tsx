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
  const [isAdding, setIsAdding] = useState(false);
  const [savingTodoId, setSavingTodoId] = useState<string | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [togglingTodoId, setTogglingTodoId] = useState<string | null>(null);

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
    if (form?.text?.trim() === "" || isAdding) return;
    setIsAdding(true);
    try {
      const res = await axios.post("/api/todos", form);
      setTodoItems((prev) => [...prev, res.data]);
      setForm({
        text: "",
        completed: false,
      });
    } catch (error) {
      console.log("Error adding todo:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const saveEdit = async (id: string | undefined) => {
    if (!id || editedText.trim() === "" || savingTodoId === id) return;
    setSavingTodoId(id);
    try {
      const res = await axios.patch(`/api/todos/${id}`, {
        text: editedText.trim(),
      });
      setTodoItems((prev) =>
        prev.map((item) => (item._id === id ? res.data : item)),
      );
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    } finally {
      setSavingTodoId(null);
    }
  };

  const deleteTodo = async (id: string | undefined) => {
    if (!id || deletingTodoId === id) return;
    setDeletingTodoId(id);
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodoItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    } finally {
      setDeletingTodoId(null);
    }
  };

  const toggleTodo = async (id: string | undefined) => {
    if (!id || togglingTodoId === id) return;
    setTogglingTodoId(id);
    try {
      const todo = todoItems.find((item) => item._id === id);
      if (!todo) return;
      const res = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodoItems((prev) =>
        prev.map((item) => (item._id === id ? res.data : item)),
      );
    } catch (error) {
      console.log("Error toggling todo:", error);
    } finally {
      setTogglingTodoId(null);
    }
  };

  return (
    <div
      id="TodoAppContainer"
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/70 w-full max-w-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Task Manager</h1>
          <p className="text-sm text-gray-500 mt-2">
            {todoItems.length} total • {todoItems.filter((item) => item.completed).length} completed
          </p>
        </div>
        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 shadow-sm border border-gray-200 p-1.5 rounded-xl bg-white"
        >
          <input
            type="text"
            value={form?.text}
            disabled={isAdding}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                text: e.target.value,
              }));
            }}
            name="text"
            placeholder="Enter a new task"
            className="flex-1 outline-none px-3 py-2.5 text-gray-700 placeholder-gray-400 bg-transparent"
            required
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            type="submit"
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add Task"}
          </button>
        </form>
        <div className="mt-5">
          {todoItems?.length === 0 ? (
            <div className="text-center text-gray-400 border border-dashed border-gray-300 rounded-2xl py-10 bg-gray-50">
              No tasks found
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todoItems?.map((item) => (
                <div
                  key={item?._id}
                  className={`rounded-2xl border px-4 py-3 transition-all ${
                    item.completed
                      ? "border-green-200 bg-green-50/60"
                      : "border-gray-200 bg-white hover:shadow-md"
                  }`}
                >
                  {editingTodo === item?._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        type="text"
                        value={editedText}
                        disabled={savingTodoId === item?._id}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="flex-1 p-3 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                      />
                      <div className="flex gap-x-2">
                        <button
                          type="button"
                          className="px-4 py-2 text-white rounded-lg hover:bg-green-600 bg-green-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          onClick={() => saveEdit(item?._id)}
                          disabled={savingTodoId === item?._id}
                        >
                          {savingTodoId === item?._id ? "..." : <MdOutlineDone />}
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-300 bg-gray-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          onClick={() => setEditingTodo(null)}
                          disabled={savingTodoId === item?._id}
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
                            type="button"
                            className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${
                              item?.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-blue-500 cursor-pointer"
                            }`}
                            onClick={() => toggleTodo(item?._id)}
                            disabled={togglingTodoId === item?._id}
                          >
                            {togglingTodoId === item?._id ? "..." : item?.completed && <MdOutlineDone />}
                          </button>
                          <span
                            className={`font-medium truncate ${
                              item.completed
                                ? "text-gray-500 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {item?.text}
                          </span>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            type="button"
                            className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => startEditing(item)}
                            disabled={deletingTodoId === item?._id}
                          >
                            <MdModeEditOutline />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => deleteTodo(item?._id)}
                            disabled={deletingTodoId === item?._id}
                          >
                            {deletingTodoId === item?._id ? "..." : <FaTrash />}
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
