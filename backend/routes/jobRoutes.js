const express = require('express');
const { getJobDetailsPublic } = require('../controllers/jobController');

const router = express.Router();

// Public job detail endpoint
router.get('/:id', getJobDetailsPublic);

module.exports = router;
