import express from 'express'
import userAuth from '../middleware/userAuth.js'

import { createTask, getTasks } from '../controller/taskController.js'

const taskRouter = express.Router()
taskRouter.use(userAuth) // applies userauth middleware to all routes in this router
taskRouter.post('/create', createTask)
taskRouter.get('/get',getTasks)

export default taskRouter