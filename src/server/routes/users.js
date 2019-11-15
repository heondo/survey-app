const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const client = require('./../db_connection');

router.use(express.json());

router.post('/signup', (req, res, next) => {
  const { first, last, email, password } = req.body;
  // has the password first, before inserting into the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    const hashPW = hash;
    const signupQuery = {
      name: 'add-user',
      text: 'INSERT INTO users(first, last, email, password) VALUES($1, $2, $3, $4) RETURNING id',
      values: [first, last, email, hashPW]
    };
    client.query(signupQuery, (err, data) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      res.status(201).json({
        success: true,
        insertID: data.rows[0].id
      });
    });
  });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const deleteQuery = {
    name: 'delete-user',
    text: 'DELETE FROM users WHERE id=$1',
    values: [id]
  };
  client.query(deleteQuery, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    res.status(200).json({
      success: true,
      message: `User deleted at id ${id}`
    });
  });
});

module.exports = router;
