import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Fetch tasks
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Add task
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false }),
      });
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setNewTask("");
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  // Toggle complete
  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
    } catch (err) {
      console.error("Update task error:", err);
    }
  };

  // Edit task title
  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
      setEditId(null);
      setEditTitle("");
    } catch (err) {
      console.error("Edit task error:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-center mb-8 text-3xl sm:text-4xl text-gray-800 sticky top-0 bg-gray-100 z-10 py-4">
         To-Do List
        </h1>

        {/* Add new task */}
        <div className="flex mb-6 bg-white p-3 rounded-lg shadow-sm flex-wrap gap-3">
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 text-base sm:text-lg rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[200px] break-words"
          />
          <button
            onClick={addTask}
            className="ml-2 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-base sm:text-lg"
          >
            Add
          </button>
        </div>

        {/* Task list */}
        <ul className="list-none p-0">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 mb-3 bg-white rounded-md border border-gray-200 shadow-sm"
            >
              {editId === task.id ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 p-2 text-sm sm:text-base rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 break-words"
                  />
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="py-1 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="py-1 px-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full items-start justify-between gap-3">
                  <span
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`flex-1 cursor-pointer text-left text-sm sm:text-base text-gray-800 break-words overflow-hidden word-break break-all ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.title} {task.completed && "✅"}
                  </span>
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="py-1 px-3 bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors text-sm sm:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;