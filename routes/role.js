const express = require('express');
const { getAllRoles, createRole } = require('../controllers/role');
const router = express.Router();

router.post('/', createRole);
router.get('/', getAllRoles);


module.exports = router;