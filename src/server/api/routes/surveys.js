const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { Client } = require('pg');

const client = new Client();
client.connect();

router.use(express.json());

router.post('/', checkAuth, (req, res, next) => {
  const { userData, body } = req;
  const { userID } = userData;
  const { surveyName, questions } = body;

  const rollBackQuery = createError => {
    client.query('ROLLBACK', err => {
      if (err) {
        res.status(500);
        return next(err);
      }
      res.status(500);
      return next(createError);
    });
  };
  // use the user ID from the token to create the survey
  client.query('BEGIN', err => {
    if (err) {
      res.status(500);
      return next(err);
    }
    const createSurveyQuery = {
      name: 'create-survey',
      text: 'INSERT INTO surveys(survey_name, user_id, date_created) VALUES($1, $2, now()) RETURNING id',
      values: [surveyName, userID]
    };
    client.query(createSurveyQuery, (err, data) => {
      if (err) {
        return rollBackQuery(err);
      }
      const surveyID = data.rows[0].id;
      // survey ID created, create the questions in questions table
      let questionsQuery = 'INSERT INTO questions(survey_id, question_name, question_type, options) VALUES ';
      let questionsValues = [];
      questions.forEach((q, i, arr) => {
        questionsQuery += (i === arr.length - 1) ? `($${1 + 4 * i}, $${2 + 4 * i}, $${3 + 4 * i}, $${4 + 4 * i})` : `($${1 + 4 * i}, $${2 + 4 * i}, $${3 + 4 * i}, $${4 + 4 * i}), `;
        questionsValues.push(surveyID, q.questionName, q.questionType, q.options);
      });
      const createQuestionsQuery = {
        name: 'create-questions',
        text: questionsQuery,
        values: questionsValues
      };
      client.query(createQuestionsQuery, (err, data1) => {
        if (err) {
          return rollBackQuery(err);
        }
        client.query('COMMIT', err => {
          if (err) {
            res.status(500);
            return next(err);
          }
          res.status(201);
          res.json({
            success: true,
            surveyID,
            message: 'Survey successfully created'
          });
        });
      });
    });
  });
});

router.get('/', checkAuth, (req, res, next) => {
  // I want to get the surveys that I have created;
  const { userData } = req;
  const { userID } = userData;
  const getUserSurveys = {
    name: 'get-user-surveys',
    text: 'SELECT s.id, s.survey_name, s.date_created, q.num_questions FROM surveys as s LEFT JOIN (SELECT survey_id, COUNT(*) as num_questions FROM questions GROUP BY survey_id) as q ON q.survey_id = s.id WHERE s.user_id = $1 ORDER BY s.date_created DESC',
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

router.get('/take/:id', (req, res, next) => {
  const { id } = req.params;
  const getSurveyQuery = {
    name: 'take-survey',
    text: 'SELECT s.id, s.survey_name, s.date_created, q.question_array FROM surveys as s LEFT JOIN (SELECT survey_id, json_agg(questions) as question_array FROM questions GROUP BY survey_id) as q ON q.survey_id = s.id WHERE s.id = $1',
    values: [id]
  };
  client.query(getSurveyQuery, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    res.status(200);
    res.json({
      success: true,
      survey: data.rows[0]
    });
  });
});

module.exports = router;

// future query for specific survey details
// 'SELECT s.id, s.survey_name, s.date_created, q.question_array FROM surveys as s LEFT JOIN (SELECT survey_id, json_agg(questions) as question_array FROM questions GROUP BY survey_id) as q ON q.survey_id = s.id WHERE s.user_id = $1'
