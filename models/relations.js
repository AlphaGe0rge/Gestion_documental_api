const Case = require("./case");
const Document = require("./document");
// const DocumentCategory = require("./documentCategory");
const Folder = require("./folder");
// const Permission = require("./permission");
const User = require("./user");

// Relación User -> Case (Un usuario tiene muchos casos)
User.hasMany(Case, { foreignKey: 'userId' });
Case.belongsTo(User, { foreignKey: 'userId' });

// Relación Case -> Folder (Un caso tiene muchas carpetas)
Case.hasMany(Folder, { foreignKey: 'caseId' });
Folder.belongsTo(Case, { foreignKey: 'caseId' });

// Relación Folder -> Document (Una carpeta tiene muchos documentos)
Folder.hasMany(Document, { foreignKey: 'folderId' });
Document.belongsTo(Folder, { foreignKey: 'folderId' });

// Relación Case -> Document (Un caso tiene muchos documentos)
Case.hasMany(Document, { foreignKey: 'caseId' });
Document.belongsTo(Case, { foreignKey: 'caseId' });

// Relación de auto-referencia Folder -> Folder (Carpetas anidadas)
Folder.hasMany(Folder, { foreignKey: 'parentFolderId', as: 'SubFolders' });
Folder.belongsTo(Folder, { foreignKey: 'parentFolderId', as: 'ParentFolder' });