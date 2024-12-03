const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db/connection");

const User = db.define('User', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING, 
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
    role: { 
        type: Sequelize.ENUM('admin', 'lawyer'),
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true 
    }
}, 
{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = User;
