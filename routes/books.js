const express = require('express');
const router = express.Router();
const {books} = require('../controllers')

/* User Signin. */
router.get('/list', books.getList);

module.exports = router;
