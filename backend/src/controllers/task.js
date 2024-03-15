const Task = require('../models/Task');
const TaskService = require('../services/task');

exports.getTasks = async (req, res) => {
  const userId = req.userId;
  const {q}= req.query;

  try {
    const query = TaskService.buildQueryGetTasks(userId, q);
    const tasks = await Task.find(query);

    return res.status(201).json({
      success: true,
      message: 'Get All Task successfully',
      tasks,
    });
  } catch (error) {
    res.status(500).json({success: false});
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @return {object}
 */
exports.createTask = async (req, res) => {
  const userId = req.userId;
  const {title} = req.body;

  try {
    const newTask = new Task({title, status: 'todo', user_id: userId});
    await newTask.save();

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: {
        title,
        status: 'todo',
        userId,
      },
    });
  } catch (error) {
    res.status(500).json({success: false});
  }
};

/**
 * Remove task
 * @param {*} req
 * @param {*} res
 * @return {object}
 */
exports.removeTask = async (req, res) => {
  const {id} = req.params;
  const userId = req.userId;

  const deletedTask = await Task.findOneAndDelete({_id: id, user_id: userId});

  if (!deletedTask) {
    return res.status(400).json({
      success: false,
      message: 'Task not found',
    });
  }

  return res.status(200).json({success: true, task: deletedTask});
};

/**
 * Edit Task
 * @param {*} req
 * @param {*} res
 * @return {object}
 */
exports.editTask = async (req, res) => {
  const {id} = req.params;
  const {title, status} = req.body;

  const userId = req.userId;

  const taskUpdateCondition = {
    _id: id,
    user_id: userId,
  };

  const taskUpdate = TaskService.buildUpdateTaskQuery(title, status);

  if (!Object.keys(taskUpdate).length) {
    return res.status(400).json({message: 'Data invalid'});
  }

  try {
    const taskAfterEdit = await Task.findOneAndUpdate(
        taskUpdateCondition,
        taskUpdate,
        {new: true},
    );

    if (!taskAfterEdit) {
      return res.status(400).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Edit success',
      task: taskAfterEdit,
    });
  } catch (error) {
    res.status(500).json({success: false, message: 'Internal server error'});
  }
};
