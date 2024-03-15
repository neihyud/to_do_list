const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const verifyToken = require('./middleware/auth');

const authController = require('./controllers/auth');
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// VERIFY TOKEN
router.use('/', verifyToken);

const taskController = require('./controllers/task');
router.get('/task', taskController.getTasks);
router.post('/task', taskController.createTask);
router.delete('/task/:id', taskController.removeTask);
router.put('/task/:id', taskController.editTask);

module.exports = router;
