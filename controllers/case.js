const { Op } = require("sequelize");
const Case = require("../models/case");
const Document = require("../models/document");

// Crear un nuevo caso
createCase = async (req, res) => {

  try {

    const {title, description, userId} = req.body

    const newCase = await Case.build({
      title,
      description,
      userId 
    });

    await newCase.save();

    res.status(201).json(newCase);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los casos
getAllCases = async (req, res) => {

  const {
    dateFrom = null,
    dateTo = null,
    title = null,
    status = null,
    userId = null
  } = req.body;

  try {

    let where = {};

    if (dateFrom && dateTo) where.createdAt = { [Op.between]: [dateFrom, dateTo] };
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (typeof status === 'boolean') where.status = status;
    if (userId) where.userId = userId;

    const cases = await Case.findAll({
      where,
      include: [{ model: Document }],
      order: ['title']
    });

    res.status(200).json(cases);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un caso por ID
getCaseById = async (req, res) => {

  try {

    const caseDetail = await Case.findByPk(req.params.id, {
      include: [{ model: Document }]
    });

    if (!caseDetail) return res.status(404).json({ error: 'Caso no encontrado' });

    res.status(200).json(caseDetail);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un caso
updateCase = async (req, res) => {

  try {

    const caseToUpdate = await Case.findByPk(req.params.id);

    if (!caseToUpdate) return res.status(404).json({ error: 'Caso no encontrado' });

    await caseToUpdate.update(req.body);

    res.status(200).json(caseToUpdate);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un caso
deleteCase = async (req, res) => {

  try {

    const caseToDelete = await Case.findByPk(req.params.id);

    if (!caseToDelete) return res.status(404).json({ error: 'Caso no encontrado' });

    await caseToDelete.destroy();

    res.status(204).send();
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    deleteCase,
    createCase,
    getAllCases,
    getCaseById,
    updateCase
}