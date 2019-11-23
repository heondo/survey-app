const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const checkAuth = require('../middleware/check-auth');
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
        expiresIn: '24h'
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
      text: 'INSERT INTO users(first, last, email, password, date_created) VALUES($1, $2, $3, $4, now()) RETURNING id',
      values: [first, last, email, hashPW]
    };
    client.query(signupQuery, (err, data) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      const token = jwt.sign({
        email: email,
        userID: data.rows[0].id
      }, process.env.JWT_KEY,
      {
        expiresIn: '24h'
      });
      res.status(201).json({
        success: true,
        insertID: data.rows[0].id,
        token
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

router.get('/surveys', checkAuth, (req, res, next) => {
  // I want to get the surveys that I have created;
  const { userData } = req;
  const { userID } = userData;
  const getUserSurveys = {
    name: 'get-user-surveys',
    text: 'SELECT s.id, s.open, s.survey_name, s.date_created, q.num_questions, num.num_responses FROM surveys as s LEFT JOIN ( SELECT survey_id, COUNT(*) as num_questions FROM questions GROUP BY survey_id ) as q ON q.survey_id = s.id LEFT JOIN ( SELECT distinct s.id as survey_id, q.num_responses from surveys as s left join ( select q.id, q.survey_id, num_r.num_responses from questions as q LEFT JOIN ( select r.question_id, count(r.group_id) as num_responses from responses as r group by r.question_id ) as num_r on num_r.question_id = q.id ) as q on s.id = q.survey_id group by s.id, q.num_responses ) as num on num.survey_id = s.id WHERE s.user_id = $1 ORDER BY s.date_created DESC',
    values: [userID]
  };
  client.query(getUserSurveys, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    res.status(200).json({
      success: true,
      surveys: data.rows
    });
  });
});

module.exports = router;
