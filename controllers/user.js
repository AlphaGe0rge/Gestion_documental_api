const { Op } = require("sequelize");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const userPost = async (req, res) => {
  
    try {
    
         const hashedPassword = await bcryptjs.hash(req.body.password, 10);
     
         const user = await User.create({
           fullName: req.body.fullName,
           userName: req.body.userName,
           password: hashedPassword,
           role: req.body.role // Asignar rol
         });
     
         res.status(201).json({ message: 'Usuario registrado con éxito' });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

const usersGet = async (req, res = response) => {

    try {

        const {where = {}} = req.body;

        if (where.userName) where.userName = {[Op.like] : `%${where.userName}%`};
        if (where.fullName) where.fullName = {[Op.like] : `%${where.fullName}%`};
        if (where.role) where.role = where.role;
        if (typeof where.status === 'boolean') where.status = where.status;

        const users = await User.findAll({
            where
        });
    
        res.json(users);
        
    } catch (err) {

        res.json({
            msg: "error",
            error: err
        });
        
    }

}

const changePassword = async (req, res) => {

    const {password, userId} = req.body

    try {
  
        const user = await User.findOne({ where: {userId} });
    
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
        const hashedPassword = await bcryptjs.hash(password, 10);

        await user.update({password: hashedPassword});

        res.status(200).json({
            msg: 'password update'
        })
        
    } catch (err) {
  
        console.error('Error al guardar el passsword:', err);
        res.status(500).json({ msg: 'Error al guardar el password' });
  
    }

}

const updateStatusUser = async (req, res) => {

    const {items} = req.body
  
    try {
  
      for (const o of items) {
  
        await User.update(
          {
            status: (o.status === 'activo') ? false : true 
          },
          {
            where: {
              userId: o.userId
            }
          }
        );
        
      }
  
      res.status(200).json({msg: 'Estado cambiado'});
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    usersGet,
    userPost,
    changePassword,
    updateStatusUser
}