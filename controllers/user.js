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

module.exports = {
    usersGet,
    userPost
}