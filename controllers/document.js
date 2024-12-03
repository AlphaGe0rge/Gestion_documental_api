 // Importar modelos de Sequelize
const fs = require('fs');
const path = require('path');
const Document = require('../models/document');
const Folder = require('../models/folder');
const Case = require('../models/case');
// const mime = require('mime/lite');

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

    const mimeType = getMimeType(document.fileType);

    // Configurar encabezados de respuesta para la descarga
    res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
    res.setHeader('Content-Type', mimeType || 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (err) => {
      console.error('Error al leer el archivo:', err);
      return res.status(500).json({ error: 'Error al descargar el documento' });
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Error al intentar descargar el archivo:', error);
    res.status(500).json({ error: 'Error al descargar el documento' });
  }
};


// exports.downloadDocument = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Encuentra el documento en la base de datos
//     const document = await Document.findByPk(id);

//     if (!document) {
//       return res.status(404).json({ error: 'Documento no encontrado' });
//     }

//     // Obtén la ruta completa al archivo
//     const filePath = path.resolve(__dirname, '../uploads', document.filePath);

//     // Verificar si el archivo existe
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: 'Archivo no encontrado en la ubicación especificada' });
//     }

//     // Configurar encabezados de respuesta para la descarga
//     const fileName = document.name || path.basename(filePath); // Usa el nombre del archivo desde la base de datos si está disponible
//     const fileMimeType = mime.getType(filePath); // Obtén el tipo MIME del archivo

//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     res.setHeader('Content-Type', fileMimeType || 'application/octet-stream');

//     // Usar stream para enviar el archivo al cliente
//     const fileStream = fs.createReadStream(filePath);

//     fileStream.on('error', (err) => {
//       console.error('Error al leer el archivo:', err);
//       return res.status(500).json({ error: 'Error al descargar el documento' });
//     });

//     fileStream.pipe(res);

//   } catch (error) {
//     console.error('Error al intentar descargar el archivo:', error);
//     res.status(500).json({ error: 'Error al descargar el documento' });
//   }
// };

// Eliminar un archivo o carpeta
exports.deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {

    const document = await Document.findByPk(id);

    if (document) {

      const filePath = path.join(__dirname, '../uploads', document.filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Eliminar archivo físico
      } else {
        console.warn(`El archivo ${filePath} no existe en el sistema de archivos.`);
      }

      await document.destroy(); // Eliminar registro de la base de datos

    }

    res.json({ message: 'Documento eliminado correctamente' });
    
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el documento' });
  }
};

exports.deleteFolder = async (req, res) => {

  const { id } = req.params;

  try {

    const folder = await Folder.findByPk(id);

    if (folder) {

      await folder.destroy(); // Eliminar registro de la base de datos

    }

    res.json({ message: 'carpeta eliminada correctamente' });
    
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la carpeta' });
  }
};

function getMimeType(fileType) {
  
  const ext = fileType.toLowerCase();

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'tiff':
    case 'tif':
      return 'image/tiff';
    case 'ico':
      return 'image/x-icon';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.ms-excel';
    case 'txt':
      return 'text/plain';
    case 'zip':
      return 'application/zip';
    default:
      return 'application/octet-stream'; // Tipo MIME por defecto
  }
}