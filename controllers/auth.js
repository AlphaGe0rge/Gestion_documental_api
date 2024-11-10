// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcryptjs = require("bcryptjs");


// Registrar un nuevo usuario
register = async (req, res) => {
  
    try {
    
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    const user = await User.create({
      fullName: req.body.fullName,
      userName: req.body.userName,
      password: hashedPassword,
      roleId: req.body.roleId // Asignar rol
    });

    res.status(201).json({ message: 'Usuario registrado con éxito' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
login = async (req, res) => {

  try {
    
    const user = await User.findOne({ where: { userName: req.body.userName } });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isPasswordValid = await bcryptjs.compare(req.body.password, user.password);

    if (!isPasswordValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.userId, roleId: user.roleId }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ 
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    register,
    login
}