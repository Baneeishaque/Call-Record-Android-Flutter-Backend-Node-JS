const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /mp3/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = file.mimetype === 'audio/mpeg' || file.mimetype === 'application/octet-stream';

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(`Error: File type not supported! extname: ${extname}, mimetype: ${mimetype}, file.mimetype: ${file.mimetype}`);
        }
    }
}).single('file');

// Route to handle file upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file === undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                res.status(200).json({
                    message: 'Upload successful!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
