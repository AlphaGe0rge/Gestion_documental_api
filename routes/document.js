const express = require('express');
const router = express.Router();
const { getRootFolders, getFolderContents, createFolder, uploadDocument, downloadDocument, deleteDocument } = require('../controllers/document');
const multer = require('multer');
const path = require('path');

const multerUpload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../uploads'),
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];

            cb(null, `${fileName}-${Date.now()}${fileExtension}`);
        },
    }),
    limits: {
        fieldSize: 10000000
    }
})

console.log(path.join(__dirname, '../uploads'));

router.get('/root/:caseId', getRootFolders);
router.get('/folder/:folderId', getFolderContents);
router.post('/create-folder', createFolder);
router.post('/upload', multerUpload.single('file'), uploadDocument);
router.get('/download/:id', downloadDocument);
router.delete('/delete/:id', deleteDocument);

module.exports = router;