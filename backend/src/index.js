const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// articles router removed
const docsRouter = require('./routes/documents');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// Choose uploads directory: env > /data/uploads (Render disk) > repo uploads
const DEFAULT_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const DATA_UPLOAD_DIR = '/data/uploads';
const UPLOAD_DIR = process.env.UPLOAD_DIR || (fs.existsSync('/data') ? DATA_UPLOAD_DIR : DEFAULT_UPLOAD_DIR);
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// articles endpoints removed
app.use('/api/documents', docsRouter);

// Simple health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend build if present (backend/public)
const CLIENT_BUILD = path.join(__dirname, '..', 'public');
if (fs.existsSync(CLIENT_BUILD)) {
    app.use(express.static(CLIENT_BUILD));
    // SPA fallback
    app.get('*', (req, res) => {
        res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
    });
}

const MONGODB = process.env.MONGODB || 'mongodb://127.0.0.1:27017/buda';
const PORT = process.env.PORT || 4000;

// Start the HTTP server immediately so the service is healthy even if DB is down.
app.listen(PORT, () => console.log('Server running on port', PORT));

// Connect to MongoDB in parallel; log status but don't block server startup.
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error', err);
        // Keep process alive to allow static/frontend and non-DB routes to work
    });
