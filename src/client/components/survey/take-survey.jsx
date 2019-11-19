import React, { useState, useEffect } from 'react';
import LoadingCircle from '../helper/loading-circle';
import { Container } from '@material-ui/core';
import querystring from 'querystring';
import styled from 'styled-components';
import { Formik, Form, FieldArray } from 'formik';
import AnswerQuestion from './answer-question';

const HeaderContainer = styled.div`
  position: relative;
  font-size: 1.5rem;
  text-align: center;
`;

const FormGroup = styled(Form)`
  position: relative;
`;

export default function TakeSurvey(props) {
  const [surveyLoaded, setSurveyLoaded] = useState(false);
  const [survey, setSurvey] = useState({});
  const [initValues, setInitValues] = useState([]);

  useEffect(() => {
    getSurveyInfo();
  }, []);

  const getSurveyInfo = () => {
    const b64 = querystring.parse(props.location.search)['?identifier'];
    const id = window.atob(b64).split('_')[1];
    fetch(`/api/surveys/take/${id}`)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error);
        }
        setSurvey(res.survey);
        createInitialValues(res.survey);
        setSurveyLoaded(true);
      })
      .catch(err => console.error(err));
  };

  const createInitialValues = survey => {
    // loop through questions set the default to first option
    const vals = survey.question_array.map(q => q.question_type === 'mult-choice' ? q.options.answerOptions[0] : '');
    setInitValues(vals);
  };

  return surveyLoaded ? (
    <Container>
      <HeaderContainer>
        {survey.survey_name} <br />
        Please answer the following.
      </HeaderContainer>
      <Formik
        initialValues={{
          questions: initValues
        }}
      >
        {({ values }) => (
          <FormGroup>
            <FieldArray
              name="questions"
              render={
                arrayHelpers => (
                  <div>
                    {
                      survey.question_array.map((q, i) => (
                        <AnswerQuestion {...props} key={q.id} index={i} question={q} value={values.questions[i]}/>
                      ))
                    }
                  </div>
                )
              }
            />
          </FormGroup>

        )}
      </Formik>
    </Container>
  ) : (
    <LoadingCircle />
  );
}
