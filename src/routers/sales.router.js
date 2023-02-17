const express = require('express');

const { saleController } = require('../controllers/sales.controller');
const validateSaleFields = require('../middlewares/sales.validations');

const router = express.Router();

router.post('/', validateSaleFields);

module.exports = router;