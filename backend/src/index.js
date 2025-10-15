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

// Avoid cached API responses while developing/iterating
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Configure uploads static serving.
// Primary: UPLOAD_DIR env or /data/uploads if available; also mount legacy backend/uploads as fallback
const LEGACY_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const PERSIST_ROOT = '/data';
const PERSIST_UPLOAD_DIR = path.join(PERSIST_ROOT, 'uploads');
const PRIMARY_UPLOAD_DIR = process.env.UPLOAD_DIR || (fs.existsSync(PERSIST_ROOT) ? PERSIST_UPLOAD_DIR : LEGACY_UPLOAD_DIR);
// Ensure primary upload dir exists
if (!fs.existsSync(PRIMARY_UPLOAD_DIR)) {
    fs.mkdirSync(PRIMARY_UPLOAD_DIR, { recursive: true });
}
console.log(`[UPLOADS][CONFIG] primary=${PRIMARY_UPLOAD_DIR} legacy=${LEGACY_UPLOAD_DIR}`);

// Log access to uploaded files for debugging
app.use('/uploads', (req, res, next) => {
    const p = path.join(PRIMARY_UPLOAD_DIR, decodeURIComponent(req.path));
    console.log(`[UPLOADS][REQ] ${req.method} ${req.originalUrl} -> ${p}`);
    res.on('finish', () => {
        console.log(`[UPLOADS][RES] ${req.method} ${req.originalUrl} -> ${res.statusCode}`);
    });
    next();
});

// Serve from primary uploads directory first, allow fallthrough to legacy
app.use('/uploads', express.static(PRIMARY_UPLOAD_DIR, { fallthrough: true }));

// Additionally, if legacy dir differs from primary, serve it under /uploads as well so old files still resolve
if (LEGACY_UPLOAD_DIR !== PRIMARY_UPLOAD_DIR && fs.existsSync(LEGACY_UPLOAD_DIR)) {
    app.use('/uploads', express.static(LEGACY_UPLOAD_DIR, { fallthrough: true }));
}

// Ensure missing files under /uploads return real 404 and do not hit SPA fallback
app.use('/uploads', (req, res) => {
    const reqPath = decodeURIComponent(req.path);
    const primaryPath = path.join(PRIMARY_UPLOAD_DIR, reqPath);
    const legacyPath = path.join(LEGACY_UPLOAD_DIR, reqPath);
    const primaryExists = fs.existsSync(primaryPath);
    const legacyExists = fs.existsSync(legacyPath);
    console.warn(`[UPLOADS][MISS] ${req.method} ${req.originalUrl} primary=${primaryPath} exists=${primaryExists} legacy=${legacyPath} exists=${legacyExists}`);
    res.status(404).type('text/plain').send('Not Found');
});

// Simple debug endpoint to check if a given filename exists in primary/legacy uploads dirs
app.get('/api/uploads/exists', (req, res) => {
    const name = (req.query.name || '').toString();
    if (!name) return res.status(400).json({ error: 'name query param required' });
    // Sanitize path traversal
    if (name.includes('..') || name.includes('/') || name.includes('\\')) {
        return res.status(400).json({ error: 'invalid name' });
    }
    const primaryPath = path.join(PRIMARY_UPLOAD_DIR, name);
    const legacyPath = path.join(LEGACY_UPLOAD_DIR, name);
    const primaryExists = fs.existsSync(primaryPath);
    const legacyExists = fs.existsSync(legacyPath);
    res.json({
        name,
        primary: { exists: primaryExists, path: primaryPath },
        legacy: { exists: legacyExists, path: legacyPath }
    });
});

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
