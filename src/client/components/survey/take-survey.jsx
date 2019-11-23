import React, { useState, useEffect } from 'react';
import LoadingCircle from '../helper/loading-circle';
import { Container, Button } from '@material-ui/core';
import querystring from 'querystring';
import styled from 'styled-components';
import { Formik, Form, FieldArray } from 'formik';
import AnswerQuestion from './answer-question';
import * as yup from 'yup';

const HeaderContainer = styled.div`
  position: relative;
  font-size: 1.5rem;
  text-align: center;
`;

const FormGroup = styled(Form)`
  position: relative;
`;

const validationSchema = yup.object().shape({
  questions: yup.array().of(yup.string().max(256, 'Please limit response to 256 characters').required('* Response is required'))
});

export default function TakeSurvey(props) {
  const [surveyLoaded, setSurveyLoaded] = useState(false);
  const [survey, setSurvey] = useState({});
  let id;

  useEffect(() => {
    getSurveyInfo();
  }, []);

  const submitSurvey = values => {
    // the answers are input here in values, get the question ID associated with it
    setSurveyLoaded(false);
    const answers = survey.question_array.map((q, i) => ({
      questionID: q.id,
      answer: values.questions[i]
    }));
    fetch(`/api/surveys/take/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error);
        }
        if (res.success) {
          props.history.push('/completed');
        }
      })
      .catch(err => {
        setSurveyLoaded(true);
        console.error(err);
      });
  };

  const getSurveyInfo = () => {
    const b64 = querystring.parse(props.location.search)['?identifier'];
    id = window.atob(b64).split('_')[1];
    fetch(`/api/surveys/take/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          if (res.error.match('no longer available')) {
            props.history.push('/survey-closed');
          }
          throw new Error(res.error);
        }
        setSurvey(res.survey);
        setSurveyLoaded(true);

      })
      .catch(err => {
        console.error(err);
      });
  };

  const createInitialValues = survey => {
    // loop through questions set the default to first option
    const vals = survey.question_array.map(q => q.question_type === 'mult-choice' ? q.options.answerOptions[0] : '');
    return vals;
  };

  return surveyLoaded ? (
    <Container>
      <HeaderContainer>
        {survey.survey_name} <br />
        Please answer the following.
      </HeaderContainer>
      <Formik
        initialValues={{
          questions: createInitialValues(survey)
        }}
        validationSchema={validationSchema}
        onSubmit={submitSurvey}
      >
        {({ handleChange, values, setFieldValue }) => (
          <FormGroup>
            <FieldArray
              name="questions"
              render={
                arrayHelpers => (
                  <div>
                    {
                      survey.question_array.map((q, i) => (
                        <AnswerQuestion {...props} key={q.id} index={i} question={q} value={values.questions[i]} handleChange={handleChange} setFieldValue={setFieldValue}/>
                      ))
                    }
                  </div>
                )
              }
            />
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </FormGroup>

        )}
      </Formik>
    </Container>
  ) : (
    <LoadingCircle />
  );
}
