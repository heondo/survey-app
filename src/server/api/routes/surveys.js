const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { Client } = require('pg');

const client = new Client();

router.use(express.json());

router.post('/', checkAuth, (req, res, next) => {
  const { userData } = req;
  res.send({ userData });
  // res.status(200).json({ token, surveyName, userData });
});

module.exports = router;
