const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filename: { type: String, required: true },
    originalname: String,
    tibetTranslationFilename: String,
    tibetOriginalName: String,
    excerpt: String,
    category: { type: String, default: 'general' },
    tags: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
