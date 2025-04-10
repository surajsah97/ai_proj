const express = require('express');
const multer = require('multer');
const { generateAd } = require('../controllers/adController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Routes
router.post('/generate-ad', upload.single('referenceImage'), generateAd);

// Error handling middleware
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File is too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            message: 'File upload error.',
            error: err.message
        });
    }
    
    if (err.message === 'Only image files are allowed!') {
        return res.status(400).json({
            message: err.message
        });
    }
    
    next(err);
});

module.exports = router;
