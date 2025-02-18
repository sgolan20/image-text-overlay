const express = require('express');
const multer = require('multer');
const { Canvas, loadImage } = require('skia-canvas');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Main endpoint for image processing
app.post('/process-image', upload.single('image'), async (req, res) => {
    try {
        const text = req.body.text || 'Default Text';
        
        // Create canvas from uploaded image
        const image = await loadImage(req.file.buffer);
        const canvas = new Canvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        
        // Draw image
        ctx.drawImage(image, 0, 0);
        
        // Add text
        ctx.font = '48px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        // Position text in center
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        
        // Convert to buffer and send
        const buffer = await canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: 'Image processing failed' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
