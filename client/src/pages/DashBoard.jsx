import { useEffect, useState } from "react";

const DashBoard = () => {
  const API_BASE = "http://localhost:4000/api/";

  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBoardName, setNewBoardName] = useState("");

  const fetchData = async () => {
    try {
      const [tasksRes, boardsRes] = await Promise.all([
        fetch(API_BASE + "task/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(API_BASE + "board/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
      ]);

      const tasksData = await tasksRes.json();
      const boardsData = await boardsRes.json();

      if (tasksData.success) setTasks(tasksData.tasks);
      else setError(tasksData.message || "Failed to fetch tasks");

      if (boardsData.success) setBoards(boardsData.boards);
      else setError(boardsData.message || "Failed to fetch boards");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const res = await fetch(API_BASE + "board/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ boardName: newBoardName }),
      });

      const data = await res.json();

      if (data.success) {
        setBoards((prev) => [...prev, data.board]);  // Add at end
        setNewBoardName("");
      } else {
        setError(data.message || "Failed to create board");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Dashboard</h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="flex gap-6 flex-wrap">
        {boards.map((board) => (
          <li
            key={board._id}
            className="border border-gray-500 w-1/4 rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">
              {board.boardName}
            </h3>

            {tasks.filter((task) => task.board === board._id).length > 0 ? (
              <ul className="space-y-2">
                {tasks
                  .filter((task) => task.board === board._id)
                  .map((task) => (
                    <li
                      key={task._id}
                      className="border border-gray-200 rounded p-2 shadow-sm"
                    >
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-gray-600 text-sm">{task.description}</p>
                      <small className="text-gray-500">
                        Created At:{" "}
                        {new Date(task.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </small>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm text-center">No tasks for this board.</p>
            )}
          </li>
        ))}

        <li className="border border-gray-500 w-1/4 rounded-lg p-4 shadow hover:shadow-md transition flex flex-col">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Board name"
            className="border border-gray-200 rounded-lg p-2 shadow-sm mb-2"
          />
          <button
            onClick={addBoard}
            className="border border-gray-200 rounded-lg p-2 shadow hover:shadow-md transition bg-indigo-600 text-white"
          >
            Add Board
          </button>
        </li>
      </ul>

      {!loading && boards.length === 0 && (
        <p className="text-gray-600 text-center mt-6">No boards found.</p>
      )}
    </div>
  );
};

export default DashBoard;
