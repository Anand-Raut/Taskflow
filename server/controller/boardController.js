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
    if (!req.userId){
        return res.json({
            success: false,
            message: 'Board name is required'
        })
    }
}