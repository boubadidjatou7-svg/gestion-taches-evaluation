const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { getTasks, addTask, editTask, removeTask } = require('../controllers/taskController');

router.use(authenticate);

router.get('/', getTasks);
router.post('/', addTask);
router.put('/:id', editTask);
router.delete('/:id', removeTask);

module.exports = router;
