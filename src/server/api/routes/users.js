const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const client = new Client();
const jwt = require('jsonwebtoken');

client.connect();

router.use(express.json());

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  const findUserQuery = {
    name: 'find-user',
    text: 'SELECT id, first, last, email, password, deleted FROM users WHERE email=$1',
    values: [email]
  };
  client.query(findUserQuery, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (!data.rows.length) {
      res.status(404);
      return next({
        message: 'Authorization Failed',
        type: 'CREDS'
      });
    }
    bcrypt.compare(password, data.rows[0].password, (err, result) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      if (!result) {
        res.status(404);
        return next({
          message: 'Authorization Failed',
          type: 'CREDS'
        });
      }
      // passwords match so now
      const { id, first, last, email } = data.rows[0];
      const token = jwt.sign({
        email: email,
        userID: id
      }, process.env.JWT_KEY,
      {
        expiresIn: '6h'
      });
      res.status(200).json({
        success: true,
        userInfo: {
          id,
          first,
          last
        },
        token
      });
    });
  });
});

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

router.delete('/:userID', (req, res, next) => {
  const { userID } = req.params;
  const deleteQuery = {
    name: 'delete-user',
    text: 'UPDATE users SET deleted=true WHERE id=$1 AND deleted=false RETURNING id',
    values: [userID]
  };
  client.query(deleteQuery, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (!data.rowCount) {
      res.status(404);
      return next({
        message: 'No user was affected by this',
        type: 'NO_EFFECT'
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: `User deleted at id ${data.rows[0].id}`
    });
  });
});

module.exports = router;
