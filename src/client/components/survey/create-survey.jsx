import React, { useState, useEffect } from 'react';
import { Container, Button } from '@material-ui/core';
import LoadingCircle from '../helper/loading-circle';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import NewQuestion from './new-question';

import * as yup from 'yup';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import styled from 'styled-components';

// import { Formik, Form, Field, ErrorMessage } from 'formik';

const validationSchema = yup.object().shape({
  surveyName: yup.string().max(128, 'Survey name is limited to 128 characters').required('* Survey name required'),
  questions: yup.array().min(1, 'One question required').of(yup.object().shape({
    questionName: yup.string().max(64, 'Question limited to 64 characters').required('Must specify the question name'),
    options: yup.object().when('questionType', {
      is: 'mult-choice',
      then: yup.object().shape({
        numOptions: yup.number().min(2, 'Must have more than one option').max(6, 'Limit of six options').required('Please enter a number'),
        answerOptions: yup.array().of(yup.string().required('Answer choice must be specified')),
        otherwise: yup.object()
      })
    })
  }))
});

export default function CreateSurvey(props) {

  const [savingSurvey, setSavingSurvey] = useState(false);

  const savedSurvey = window.localStorage.getItem('savedSurvey') || null;

  const saveSurvey = values => {
    setSavingSurvey(true);
    const token = window.localStorage.getItem('token');
    fetch('/api/surveys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setSavingSurvey(false);
          throw new Error(res.error);
        }
        window.localStorage.removeItem('savedSurvey');
        props.history.push('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <Container>
      <h2>Create Survey</h2>
      {(savingSurvey) ? (<LoadingCircle />) : (<Formik
        initialValues={JSON.parse(savedSurvey) || {
          surveyName: '',
          questions: [{
            questionName: '',
            questionType: 'mult-choice',
            options: {
              numOptions: 2,
              answerOptions: ['', ''],
              multipleSelect: false
            }
          }]
        }}
        validationSchema={validationSchema}
        onSubmit={saveSurvey}
      >
        {({ values, setFieldValue }) => (
          <FormGroup
            onChange={e => {
              window.localStorage.setItem('savedSurvey', JSON.stringify(values));
            }}
          >
            <FieldArray
              name="questions"
              render={arrayHelpers => (
                <div>
                  <label
                    htmlFor="surveyName">
                    Survey Name
                  </label>
                  <InputField
                    id="surveyName"
                    name="surveyName"
                    placeholder="My very own survey"
                  >
                  </InputField>
                  <ErrorLabel
                    name="surveyName"
                    component="div" />
                  {
                    (values.questions.length && values.questions.length < 11)
                      ? values.questions.map((q, i) => (
                        <NewQuestion key={i} index={i} setFieldValue={setFieldValue} arrayHelpers={arrayHelpers} question={values.questions[i]} />
                      )) : (
                        <NoQuestions>You have no questions</NoQuestions>
                      )
                  }
                  {
                    values.questions.length ? (
                      <Button
                        type="submit"
                        variant="contained"
                        style={{
                          margin: '1rem 0'
                        }}
                      >
                        Save
                      </Button>
                    ) : undefined
                  }
                  <AddQuestion>
                    {values.questions.length > 9 ? <div /> : (
                      <>
                        <SubHeader>
                          New Question
                        </SubHeader>
                        <AddCircleIcon
                          fontSize="large"
                          style={{ margin: 'auto' }}
                          onClick={() => {
                            arrayHelpers.push({
                              questionName: '',
                              questionType: 'mult-choice',
                              options: {
                                numOptions: 2,
                                answerOptions: ['', ''],
                                multipleSelect: false
                              }
                            });
                          }} />
                      </>
                    )}
                  </AddQuestion>
                </div>
              )}
            />
          </FormGroup>
        )}
      </Formik>)}

    </Container>
  );
}

const FormGroup = styled(Form)`
  position: relative;
`;

const InputField = styled(Field)`
  width: 100%;
  font-size: 1rem;
  height: 2.5rem;
  padding: .2rem;
  margin-bottom: 1rem;
  border: none;
  border-bottom: 1px solid black;
`;

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  position: absolute;
  top: 4.2rem;
  color: red;
`;

const AddQuestion = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SubHeader = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const NoQuestions = styled(SubHeader)`
  text-align: left;
`;
