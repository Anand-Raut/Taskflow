import boardModel from "../models/boardModel.js";

export const createBoard = async (req, res) => {
    const { boardName } = req.body;

    if (!boardName) {
        return res.json({
            success: false,
            message: 'Board name is required'
        })
    }
    try {
        const userId = req.userId
        const board = new boardModel({
            boardName,
            createdBy: userId,
            members: [userId],
            createdAt: Date.now()
        })
        await board.save()
        return res.json({
            success: true,
            message: 'Board created successfully',
            board
        })       
    } catch (error) {
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
}

export const getBoards = async (req, res) => {
    try {
        const userId = req.userId
        const boards = await boardModel.find({members: userId}).populate([{ path: 'createdBy', select: 'name email' }, { path: 'members', select: 'name email' }]).sort()
        return res.json({
            success: true,
            boards: boards
        })

    }
    catch (error) {
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
} 

export const getBoardbyId = async (req, res) => {
    if (!req.userId){
        return res.json({
            success: false,
            message: 'Board name is required'
        })
    }
    try{
        const {boardId} = req.body
        const board  = await boardModel.findById(boardId).populate([{path: 'createdBy', select: 'name email' }, { path: 'members', select: 'name email '}])
        return res.json({
            success: true,
            board
        })
    }catch (error) {
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
}

export const deleteBoardById = async (req, res) => {
    const {boardId} = req.body
    if (!boardId){
        return res.json({
            success: false,
            message: 'Board Id is required'
        })
    }
    try {
        const {boardId} = req.body
        await boardModel.findByIdAndDelete(boardId)
        return res.json({
            success: true,
            message: 'Board deleted successfully'
        })
    } catch (error) {
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        })
    }
}

export const addMember = async (req, res) => {
    const { boardId, email } = req.body;

    if (!boardId || !email) {
        return res.json({
            success: false,
            message: 'Board ID and user email are required'
        });
    }

    try {
        const board = await boardModel.findById(boardId);
        if (!board) {
            return res.json({
                success: false,
                message: 'Board not found'
            });
        }

        // Find user by email
        const userModel = (await import('../models/userModel.js')).default;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }
        const newUserId = user._id;

        // Check if user is already a member
        if (board.members.includes(newUserId)) {
            return res.json({
                success: false,
                message: 'User is already a member of this board'
            });
        }

        board.members.push(newUserId);
        await board.save();

        return res.json({
            success: true,
            message: 'User added to board successfully',
            board
        });
    } catch (error) {
        return res.json({
            success: false,
            message: `Error encountered: ${error.message}`
        });
    }
}