const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    points: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

// Function to create a new task
async function createTask(userId, description, dueDate, points) {
    const task = new Task({
        userId,
        description,
        dueDate,
        points
    });
    return await task.save();
}

// Function to retrieve tasks for a user
async function getUserTasks(userId) {
    return await Task.find({ userId: userId }).sort({ dueDate: 1 });
}

// Function to update a task
async function updateTask(taskId, updates) {
    return await Task.findByIdAndUpdate(taskId, { ...updates, updatedAt: Date.now() }, { new: true });
}

// Function to mark a task as completed
async function completeTask(taskId) {
    return await Task.findByIdAndUpdate(taskId, { completed: true, updatedAt: Date.now() }, { new: true });
}

// Function to delete a task
async function deleteTask(taskId) {
    return await Task.findByIdAndDelete(taskId);
}

module.exports = {
    Task,
    createTask,
    getUserTasks,
    updateTask,
    completeTask,
    deleteTask
};
