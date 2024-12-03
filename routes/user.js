const express = require('express');
const { usersGet, userPost } = require('../controllers/user');
const router = express.Router();

router.post('/get', usersGet);
router.post('/', userPost);

module.exports = router;