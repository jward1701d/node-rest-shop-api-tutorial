const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const UsersController = require('../controllers/users');

router.post('/signup', UsersController.Signup);
router.post('/login',UsersController.Login);
router.delete('/:userId', checkAuth,UsersController.DeleteUser);

module.exports = router;