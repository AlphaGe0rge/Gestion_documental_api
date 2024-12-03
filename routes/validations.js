const {Router} = require('express');
const { checkCedula, checkEmail, checkUserName } = require('../controllers/validations');

const router = Router();

router.post('/checkUserName', checkUserName);

module.exports = router;