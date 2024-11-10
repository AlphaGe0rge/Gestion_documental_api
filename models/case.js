const { DataTypes } = require("sequelize");
const db = require("../db/connection");
const User = require("./user");

const Case = db.define('Case', {
    caseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    userId: {  // Relación con User
        type: DataTypes.UUID,
        references: {
          model: User,  // Hace referencia a la tabla Users
          key: 'userId'
        },
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

module.exports = Case