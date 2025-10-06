// Articles API removed — returning 404 for all article routes.
const express = require('express');
const router = express.Router();

router.all('*', (req, res) => res.status(404).json({ error: 'Articles endpoint removed' }))

module.exports = router;
