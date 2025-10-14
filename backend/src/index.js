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

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
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

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log('Server running on port', PORT));
    })
    .catch(err => {
        console.error('MongoDB connection error', err);
        // don't exit immediately in some PaaS environments; keep process alive so logs are visible
        // process.exit(1);
    });
