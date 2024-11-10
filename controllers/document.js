 // Importar modelos de Sequelize
const fs = require('fs');
const path = require('path');
const Document = require('../models/document');
const Folder = require('../models/folder');
const Case = require('../models/case');

// Obtener carpetas y archivos en la raíz
exports.getRootFolders = async (req, res) => {
  try {

    const {caseId} = req.params

    const folders = await Folder.findAll({ 
      where: { parentFolderId: null,
               caseId : caseId
              }, 
      include: Case 
    });

    const files = await Document.findAll({ 
      where: { folderId: null }
    });

    res.json({ folders, files });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las carpetas y archivos en la raíz' });
  }
};

// Obtener contenido de una carpeta específica
exports.getFolderContents = async (req, res) => {

  const { folderId } = req.params;
  
  try {
  
    const folders = await Folder.findAll({ 
      where: { parentFolderId: folderId }, 
      include: Case 
    });
    const files = await Document.findAll({ where: { folderId } });
    res.json({ folders, files });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el contenido de la carpeta' });
  }
};

// Crear una nueva carpeta
exports.createFolder = async (req, res) => {

  const { name, caseId, parentFolderId } = req.body;

  try {
    
    const newFolder = await Folder.build({ name, caseId, parentFolderId });

    await newFolder.save()

    res.json(newFolder);

  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Subir un archivo
exports.uploadDocument = async (req, res) => {
  
  const { title, folderId, caseId } = req.body;

  // Si el archivo no está presente, devolver error
  if (!req.file) return res.status(400).json({ error: 'Archivo no encontrado' });

  const filePath = req.file.path; // Ruta donde se guardó el archivo

  try {

    const newDocument = await Document.build({
      name: title,
      folderId: folderId || null,
      fileType: path.extname(req.file.originalname).slice(1),
      caseId,
      filePath: req.file.filename
    });

    newDocument.save();

    res.json(newDocument);

  } catch (error) {
    res.status(500).json({ error: error});
  }
};

exports.downloadDocument = async (req, res) => {

  const { id } = req.params;

  try {
    // Encuentra el documento en la base de datos
    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Obtén la ruta completa al archivo
    const filePath = path.resolve(__dirname, '../uploads', document.filePath);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado en la ubicación especificada' });
    }

    // Configurar encabezados de respuesta para la descarga
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Enviar archivo al cliente
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
        res.status(500).json({ error: 'Error al descargar el documento' });
      }
    });

  } catch (error) {
    console.error('Error al intentar descargar el archivo:', error);
    res.status(500).json({ error: 'Error al descargar el documento' });
  }
};


// Eliminar un archivo o carpeta
exports.deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Document.findByPk(id);
    if (document) {
      fs.unlinkSync(document.filePath); // Eliminar archivo físico
      await document.destroy(); // Eliminar registro de la base de datos
    }
    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el documento' });
  }
};
