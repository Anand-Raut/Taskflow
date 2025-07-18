import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    boardName: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    createdAt: { type: Date, default: Date.now }
});

const boardModel = mongoose.models.board || mongoose.model('board', boardSchema);

export default boardModel;
