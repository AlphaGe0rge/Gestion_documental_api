const { DataTypes } = require("sequelize");
const db = require("../db/connection");
const Case = require("./case");
const Folder = require("./folder");

const Document = db.define('Document', {
    documentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    filePath: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    fileType: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    uploadedAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    },
    folderId: {  // Relación con Folder
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Folder,
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
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

module.exports = Document;