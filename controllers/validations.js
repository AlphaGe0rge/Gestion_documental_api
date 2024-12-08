const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const checkUserName = async (req, res = response) => {

    const {userName} = req.body

    try {

        const userNameExist = await User.findOne({ where: { userName } }); // Buscamos el email en la BD

        if (userNameExist) {
          return res.status(200).json(true);
        } else {
          return res.status(200).json(false);
        }
        
    } catch (err) {

        console.error('Error al validar el userName:', err);
        res.status(500).json({ message: 'Error al validar el userName' });

    }
}

const checkPassword = async (req, res = response) => {

  const {password, userId} = req.body

  try {

      const user = await User.findOne({ where: {userId} });
  
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      const isPasswordValid = await bcryptjs.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(200).json(true);
      } else {
        return res.status(200).json(false);
      }
      
  } catch (err) {

      console.error('Error al validar el passsword:', err);
      res.status(500).json({ message: 'Error al validar el password' });

  }
}

module.exports = {
    checkUserName,
    checkPassword
}