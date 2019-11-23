const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const { Client } = require('pg');

const client = new Client();
client.connect();

router.use(express.json());

router.delete('/:id', checkAuth, (req, res, next) => {
  const { userData, params } = req;
  const { userID } = userData;
  const { id: surveyID } = params;
  const deleteQuery = {
    name: 'delete-query',
    text: 'update surveys set open = false WHERE id = $1 and user_id = $2 and open=true returning id',
    values: [surveyID, userID]
  };
  client.query(deleteQuery, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (!data.rowCount) {
      res.status(404);
      return next({
        type: 'Failed to Update',
        message: 'Either the survey is already closed or credentials do not match'
      });
    }
    res.status(200);
    res.json({
      success: true,
      message: `Updated survey at ID: ${data.rows[0].id}`,
      surveyID: data.rows[0].id
    });
  });
});

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

router.post('/take/:id', (req, res, next) => {
  const { id } = req.params;
  const { questionID, answers } = req.body;
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
  // res.send(answers);
  client.query('BEGIN', err => {
    if (err) {
      res.status(500);
      return next(err);
    }
    const getGroupIDQuery = 'SELECT COALESCE(MAX(group_id), 0) + 1 AS newGroupID FROM responses';
    client.query(getGroupIDQuery, (err, groupIDData) => {
      if (err) {
        return rollBackQuery(err);
      }
      const newGroupID = groupIDData.rows[0].newgroupid;
      let insertText = 'INSERT INTO responses(question_id, group_id, response, date_response) VALUES ';
      let insertValues = [];
      answers.forEach((a, i, arr) => {
        insertText += `($${1 + 3 * i}, $${2 + 3 * i}, $${3 + 3 * i}, now())`;
        if (i !== arr.length - 1) {
          insertText += ',';
        }
        insertValues.push(a.questionID, newGroupID, a.answer);
      });
      const insertResponsesQuery = {
        name: 'insert-response-array',
        text: insertText,
        values: insertValues
      };
      client.query(insertResponsesQuery, (err, insertData) => {
        if (err) {
          return rollBackQuery(err);
        }
        client.query('COMMIT', err => {
          if (err) {
            res.status(500);
            return next(err);
          }
          res.status(200);
          res.json({
            success: true,
            message: `Inserted ${insertData.rowCount} responses`
          });
        });
      });
    });
  });
});

router.get('/results/:surveyID', checkAuth, (req, res, next) => {
  const { userData, params } = req;
  const { surveyID } = params;
  const { userID } = userData;
  const surveyResponsesQuery = {
    name: 'survey-responses',
    text: "SELECT s.id AS survey_id, s.user_id, s.survey_name, s.date_created AS survey_date, q.question_id, q.question_info, q.responses FROM surveys AS s LEFT JOIN ( SELECT q.id as question_id, q.survey_id, json_build_object('questionName', q.question_name, 'questionType', q.question_type, 'options', q.options) as question_info, json_agg(json_build_object('responseGroup', r.group_id, 'response', r.response, 'responseDate', r.date_response)) as responses FROM questions as q LEFT JOIN ( SELECT * FROM responses ) as r ON r.question_id = q.id GROUP BY q.id ) AS q ON s.id = q.survey_id WHERE s.id = $1 AND s.user_id = $2",
    values: [surveyID, userID]
  };
  client.query(surveyResponsesQuery, (err, data) => {
    if (err) {
      res.status(500);
      return next(err);
    }
    if (data.rows[0].user_id !== parseInt(userID)) {
      res.status(404);
      return next({
        type: 'Bad Creds',
        message: 'Authenticated user does not match survey owner'
      });
    }
    const responses = data.rows;
    const answerCounts = responses.filter(r => r.question_info.questionType === 'mult-choice').map(r => {
      const { options, questionName } = r.question_info;
      let chartData = {
        x: questionName,
        results: {}
      };
      options.answerOptions.forEach(answerOption => {
        chartData.results[answerOption] = 0;
      });
      r.responses.forEach(userResponse => {
        chartData.results[userResponse.response]++;
      });
      return chartData;
    });
    // There is going to be an x value for each Question.
    const chartResponse = answerCounts.map(q => {
      let tempData = {};
      const xValue = q.x;
      for (let answerOption in q.results) {
        tempData[answerOption] = {
          x: xValue,
          y: q.results[answerOption]
        };
      }
      return tempData;
    });

    res.status(200);
    res.json({
      success: true,
      responses,
      responseCount: responses[0].responses[0].responseGroup ? responses[0].responses.length : 0,
      answerCounts,
      chartResponse
    });
  });
  // get survey data,
  // get survey data, if the survey owner id doesnt match the token id dont let thmem?
  // so for a single survey, there are three questions
});

module.exports = router;

// future query for specific survey details
// 'SELECT s.id, s.survey_name, s.date_created, q.question_array FROM surveys as s LEFT JOIN (SELECT survey_id, json_agg(questions) as question_array FROM questions GROUP BY survey_id) as q ON q.survey_id = s.id WHERE s.user_id = $1'
