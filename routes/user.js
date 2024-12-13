const express = require('express');
const { usersGet, userPost, changePassword, updateStatusUser } = require('../controllers/user');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = express.Router();

router.use(validarJWT);

router.post('/get', usersGet);
router.post('/', userPost);
router.put('/', changePassword)
router.put('/changeStatus', updateStatusUser)


module.exports = router;