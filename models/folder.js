const { DataTypes } = require("sequelize");
const db = require("../db/connection");
const Case = require("./case");

const Folder = db.define('Folder', {
    folderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parentFolderId: {  // Auto-referencia para carpetas anidadas
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Folder',  // Se auto-referencia a la misma tabla Folder
        key: 'folderId'
      }
    },
    caseId: {  // Relación con Case
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Case,
        key: 'caseId'
      }
    }
}, 
{
    tableName: 'Folder',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = Folder;