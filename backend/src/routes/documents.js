const express = require('express');
const multer = require('multer');
const path = require('path');
const Document = require('../models/document');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
        cb(null, safe);
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    const { q, category, tags } = req.query;
    const filter = {};
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { excerpt: new RegExp(q, 'i') }];
    if (category) filter.category = category;
    if (tags) {
        // tags can be comma separated; match if document has any of these tags
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        filter.tags = { $in: tagList };
    }
    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
});

router.post('/', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'tibet_pdf', maxCount: 1 }]), async (req, res) => {
    try {
        const file = req.files['pdf'] ? req.files['pdf'][0] : null;
        const tib = req.files['tibet_pdf'] ? req.files['tibet_pdf'][0] : null;
        if (!file) return res.status(400).json({ error: 'pdf is required' });
        const tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        const doc = new Document({
            title: req.body.title || file.originalname,
            filename: file.filename,
            originalname: file.originalname,
            tibetTranslationFilename: tib ? tib.filename : null,
            tibetOriginalName: tib ? tib.originalname : null,
            excerpt: req.body.excerpt || '',
            category: req.body.category || 'general',
            tags
        });
        await doc.save();
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
