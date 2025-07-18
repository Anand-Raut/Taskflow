import { useEffect, useState } from "react";

const DashBoard = () => {
  const API_BASE = "http://localhost:4000/api/";
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        let res = await fetch(API_BASE + "task/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        let data = await res.json();
        if (data.success) {
          setTasks(data.tasks);
        } else {
          setError(data.message || "Failed to fetch tasks");
        }

        res = await fetch(API_BASE + "board/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        data = await res.json();
        if (data.success) {
          setBoards(data.boards);
        } else {
          setError(data.message || "Failed to fetch Boards");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="p-8 mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Dashboard</h1>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {boards.length > 0 ? (
        <ul className="flex gap-6 flex-wrap">
          {boards.map((board) => (
            <li
              key={board._id}
              className="border border-gray-500 w-1/4 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">
                {board.boardName}
              </h3>

              {tasks.filter((task) => task.boardId === board._id).length > 0 ? (
                <ul className="space-y-2">
                  {tasks
                    .filter((task) => task.boardId === board._id)
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
        </ul>
      ) : (
        !loading && <p className="text-gray-600">No boards found.</p>
      )}
    </div>
  );
};

export default DashBoard;
