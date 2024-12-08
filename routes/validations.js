const {Router} = require('express');
const { checkUserName, checkPassword } = require('../controllers/validations');

const router = Router();

router.post('/checkUserName', checkUserName);
router.post('/checkPassword', checkPassword)

module.exports = router;