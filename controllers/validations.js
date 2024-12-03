const User = require("../models/user");

checkUserName = async (req, res = response) => {

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

module.exports = {
    checkUserName
}