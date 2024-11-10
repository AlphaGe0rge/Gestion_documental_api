const Role = require("../models/role");

// Crear un nuevo caso
createRole = async (req, res) => {

  try {

    const {name} = req.body

    const newRole = await Role.build({
      name,
    });

    await newRole.save();

    res.status(201).json(newRole);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los casos
getAllRoles = async (req, res) => {

  try {

    const Roles = await Role.findAll();

    res.status(200).json(Roles);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    createRole,
    getAllRoles
}