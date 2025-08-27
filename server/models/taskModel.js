import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'board', required: true },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

const taskModel = mongoose.models.task || mongoose.model('task', taskSchema);

export default taskModel;
