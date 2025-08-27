import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { createBoard, getBoards, getBoardbyId, deleteBoardById, addMember } from '../controller/boardController.js'

const boardRouter = express.Router()
// boardRouter.use(userAuth) // applies userauth middleware to all routes in this router
boardRouter.post('/create',userAuth, createBoard)
boardRouter.get('/get',userAuth, getBoards)
boardRouter.get('/getById', userAuth, getBoardbyId)
boardRouter.delete('/delete', deleteBoardById)
boardRouter.patch('/addMember', userAuth, addMember)

export default boardRouter