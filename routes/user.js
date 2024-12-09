const express = require('express');
const { usersGet, userPost, changePassword, updateStatusUser } = require('../controllers/user');
const router = express.Router();

router.post('/get', usersGet);
router.post('/', userPost);
router.put('/', changePassword)
router.put('/changeStatus', updateStatusUser)


module.exports = router;