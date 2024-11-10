const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db/connection");

const Role = db.define('Role', {
    roleId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: { 
        type: Sequelize.ENUM('admin', 'lawyer'),
        allowNull: false,
        unique: true, 
        allowNull: false 
    }
}, 
{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = Role;