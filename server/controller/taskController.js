import taskModel from "../models/taskModel.js"
import boardModel from "../models/boardModel.js"


export const createTask = async (req, res) =>{
    const {title, description, boardId, dueDate} = req.body

    if (!title || !boardId){
        return res.json({
            success: false,
            message: 'Missing Details'
        })
    }
    try {
        const userId = req.userId
        const task = new taskModel({
            title,
            description,
            boardId: boardId,
            dueDate: dueDate ? new Date(dueDate) : null,
            createdAt: Date.now()
        })
        await task.save()
        return res.json({
            success:true,
            message: 'Task created successfully',
            task
        })
    }catch( error ){
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
}

// export const getTasksbyuserId = async (req, res) => {

//     try {
//         const boardId = req.boardId
//         if (!boardId){
//             return res.json({
//                     success: false,
//                     message: "Board ID not found"
//             });
//         }

//         const tasks = taskModel.find({boardId : boardId})
//         return res.json({
//             success: true,
//             tasks: tasks
//         })

//     } catch (error) {
//         return res.  json({
//             success: false,
//             message: `Error while fetching tasks: ${error.message}`
//         });
//     }
// }

export const getTasks = async(req, res) =>{
    try {
        const userId = req.userId;
        const boards = await boardModel.find({ members: userId }).select('_id ');
        const boardIds = boards.map(board => board._id);
        if (boardIds.length === 0) {
            return res.json({
                success: false,
                message: "No boards found for the current user"
            });
        }
        const tasks = await taskModel.find({ boardId: { $in: boardIds } });

        if (tasks.length === 0){
            return res.json({
                success: false,
                message: "No tasks for the current user"
            })
        }
        return res.json({
            success: true,
            tasks: tasks
        })
    } catch (error) {
        return res.json({
            success: false,
            message: `Encountered error: ${error}`
        })
    }

}

export const markTaskAsDone = async (req, res) => {
    const {taskId} = req.body
    if (!taskId){
        return res.json({
            success: false,
            message: "Task ID not found"
        })
    }
    try {
        const task = await taskModel.findByIdAndUpdate(taskId, {status: "done", completedAt: Date.now()})
        if (!task) {
            return res.json({success: false, message: "Task not found"})
        }
        return res.json({success: true, message: "Task marked as done", task})
    } catch (error) {
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
}