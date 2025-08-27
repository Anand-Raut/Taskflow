import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashBoard = () => {
  const API_BASE = "http://localhost:4000/api/";
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [taskInputs, setTaskInputs] = useState({
    title: "",
    description: "",
    boardId: "",
    dueDate: "",
  });

  const addBoard = async () => {
    if (!newBoardName.trim()) return;
    const res = await fetch(API_BASE + "board/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardName: newBoardName }),
    });
    const data = await res.json();
    if (data.success) {
      setBoards((prev) => [...prev, data.board]);
      setNewBoardName("");
    } else {
      console.error(data.message);
    }
  };

  const addTask = async (boardId) => {
    const { title, description, dueDate } = taskInputs;
    if (!title.trim()) return alert("Title is required");

    const res = await fetch(API_BASE + "task/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, description, boardId, dueDate }),
    });

    const data = await res.json();
    if (data.success) {
      setTasks((prev) => [...prev, data.task]);
      setTaskInputs({ title: "", description: "", boardId: "", dueDate: "" });
    } else {
      console.error(data.message);
    }
  };
  const markTaskAsDone = async (taskId) => {
    const res = await fetch(API_BASE + "task/markdone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ taskId }),
    });
    const data = await res.json();
    if (data.success) {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    }
  };

  const deleteBoard = async (boardId) => {
    const res = await fetch(API_BASE+"board/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ boardId }),
    });
    const data = await res.json();
    if (data.success) {
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
    }
  };

  const addMember = async (boardId, email) => {
    if (!boardId || !email) return;

    const res = await fetch(API_BASE + "board/addMember", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ boardId, email }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Member added successfully");
    } else {
      console.error(data.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [taskRes, boardRes] = await Promise.all([
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

        const taskData = await taskRes.json();
        const boardData = await boardRes.json();

        if (taskData.success) setTasks(taskData.tasks );
        else setError(taskData.message || "Failed to fetch tasks");

        if (boardData.success) setBoards(boardData.boards);
        else setError(boardData.message || "Failed to fetch boards");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-10 w-full mx-auto space-y-16 bg-gradient-to-br from-zinc-950 to-zinc-900 min-h-screen text-white font-sans">
      <h1 className="text-6xl font-extrabold tracking-tight text-center uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">
        DashBoard
      </h1>

      {loading && <p className="text-zinc-400 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boards.map((board) => {
          const boardTasks = tasks.filter((task) => task.boardId === board._id && task.status !== "done");
          return (
            <Card
              key={board._id}
              className="rounded-3xl shadow-2xl bg-gradient-to-b from-zinc-900 to-zinc-800 border border-zinc-700/70 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-emerald-400">
                  {board.boardName}
                  </CardTitle>
                  <button onClick={() => deleteBoard(board._id)}>
                    <span className="text-sm text-zinc-400">🗑️</span>
                  </button>
                </div>
                
              </CardHeader>
              <CardContent className="space-y-5">
                {boardTasks.length > 0 ? (
                  boardTasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 bg-zinc-800/70 border border-zinc-700 rounded-xl hover:shadow-lg transition-shadow backdrop-blur"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-semibold text-white w-3/4">
                          {task.title}
                        </h4>
                        <button onClick={() => markTaskAsDone(task._id)}>
                          <span className="text-sm text-zinc-400">✅</span>
                        </button>
                      </div>
                      <p className="text-sm text-zinc-400">
                        {task.description}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-zinc-500">No tasks yet</p>
                )}

                <div className="space-y-4 pt-6 border-t border-zinc-700">
                  <Input
                    placeholder="Task title"
                    className="bg-zinc-900 text-white placeholder-zinc-500 border-zinc-700 rounded-lg"
                    value={taskInputs.boardId === board._id ? taskInputs.title : ""}
                    onChange={(e) =>
                      setTaskInputs({
                        ...taskInputs,
                        title: e.target.value,
                        boardId: board._id,
                      })
                    }
                  />
                  <Input
                    placeholder="Description"
                    className="bg-zinc-900 text-white placeholder-zinc-500 border-zinc-700 rounded-lg"
                    value={taskInputs.boardId === board._id ? taskInputs.description : ""}
                    onChange={(e) =>
                      setTaskInputs({
                        ...taskInputs,
                        description: e.target.value,
                        boardId: board._id,
                      })
                    }
                  />
                  <Input
                    type="date"
                    className="bg-zinc-900 text-white placeholder-zinc-500 border-zinc-700 rounded-lg"
                    value={taskInputs.boardId === board._id ? taskInputs.dueDate : ""}
                    onChange={(e) =>
                      setTaskInputs({
                        ...taskInputs,
                        dueDate: e.target.value,
                        boardId: board._id,
                      })
                    }
                  />
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium tracking-wide rounded-xl" onClick={() => addTask(board._id)}>
                    Add Task
                  </Button>
                </div>
                <div className="pt-4">
                  <h4 className="text-sm font-medium text-zinc-400">Members</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {board.members.map((member) => (
                      <span key={member._id} className="bg-zinc-800 text-zinc-400 text-xs font-medium py-1 px-2 rounded">
                        {member.name}
                      </span>
                    ))}
                    <Input
                      placeholder="Add member by email"
                      className="bg-zinc-900 text-white placeholder-zinc-500 border-zinc-700 rounded-lg"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg" onClick={() => addMember(board._id, newMemberEmail)}>
                      Add Member
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="border-4 border-dashed bg-zinc-9 00 border-emerald-500/60 hover:bg-emerald-500/10 backdrop-blur rounded-3xl flex flex-col justify-center items-center p-8">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-emerald-400 text-xl font-semibold">Create New Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 w-full">
            <Input
              placeholder="Board name"
              className="bg-zinc-900 text-white placeholder-zinc-500 border-zinc-700 rounded-lg"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl" onClick={addBoard}>
              Create Board
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoard;
