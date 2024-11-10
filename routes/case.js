const express = require('express');
const router = express.Router();
const { createCase, getAllCases, getCaseById, updateCase, deleteCase } = require('../controllers/case');

// router.post('/', authMiddleware, caseController.createCase);
// router.get('/', authMiddleware, caseController.getAllCases);
// router.get('/:id', authMiddleware, caseController.getCaseById);
// router.put('/:id', authMiddleware, roleMiddleware(['abogado']), caseController.updateCase);
// router.delete('/:id', authMiddleware, roleMiddleware(['abogado']), caseController.deleteCase);

router.post('/', createCase);
router.get('/', getAllCases);
router.get('/:id', getCaseById);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

module.exports = router;