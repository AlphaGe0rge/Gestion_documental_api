const express = require('express');
const router = express.Router();
const { createCase, getAllCases, updateCase, deleteCase, updateStatusCase } = require('../controllers/case');

// router.post('/', authMiddleware, caseController.createCase);
// router.get('/', authMiddleware, caseController.getAllCases);
// router.get('/:id', authMiddleware, caseController.getCaseById);
// router.put('/:id', authMiddleware, roleMiddleware(['abogado']), caseController.updateCase);
// router.delete('/:id', authMiddleware, roleMiddleware(['abogado']), caseController.deleteCase);

router.post('/', createCase);
router.post('/casesGet', getAllCases);
router.put('/:id', updateCase);
router.put('/', updateStatusCase);
router.delete('/:id', deleteCase);

module.exports = router;