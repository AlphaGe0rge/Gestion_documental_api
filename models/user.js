const { DataTypes } = require("sequelize");
const db = require("../db/connection");
const Role = require("./role");

const User = db.define('User', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    userName: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    roleId: { 
        type: DataTypes.UUID,
        references: {
          model: Role,  // Hace referencia a la tabla Roles
          key: 'roleId'
        },
        allowNull: false
    }
}, 
{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = User;
