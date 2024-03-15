const TaskService = {
  buildUpdateTaskQuery(title, status) {
    const taskUpdate ={};

    if (title) {
      taskUpdate.title = title;
    }
    if (status) {
      taskUpdate.status = status;
    }

    return taskUpdate;
  },

  buildQueryGetTasks(userId, status) {
    const query = {
      user_id: userId,
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    return query;
  },
};

module.exports = TaskService;
