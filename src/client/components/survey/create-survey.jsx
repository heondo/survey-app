import React, { useState, useEffect } from 'react';
import { Container, TextField, Box } from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import NewQuestion from './new-question';

import * as yup from 'yup';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import styled from 'styled-components';

// import { Formik, Form, Field, ErrorMessage } from 'formik';

const validationSchema = yup.object().shape({
  surveyName: yup.string().required('* Survey name required'),
  questions: yup.array().of(yup.object().shape({
    questionName: yup.string().required('Must specify the question name'),
    options: yup.object().shape({
      numOptions: yup.number('Please enter a number').min(2, 'Must have more than one option').max(6, 'Limit of six options').required('Input required')
    })
  }))
});

export default function CreateSurvey(props) {

  return (
    <Container>
      <h2>Create Survey</h2>
      <Formik
        initialValues={{
          surveyName: '',
          questions: []
        }}
        validationSchema={validationSchema}
      >
        {({ values }) => (
          <FormGroup>
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
                        <NewQuestion key={i} index={i} arrayHelpers={arrayHelpers} question={values.questions[i]}/>
                      )) : (
                        <NoQuestions>You have no questions</NoQuestions>
                      )
                  }
                  <AddQuestion>
                    <SubHeader>
                      New Question
                    </SubHeader>
                    <div>
                      {values.questions.length === 10 ? <div/> : (
                        <AddCircleIcon
                          fontSize="large"
                          style={{ margin: 'auto' }}
                          onClick={() => {
                            arrayHelpers.push({
                              questionName: '',
                              questionType: 'mult-choice',
                              options: {
                                numOptions: 2,
                                answerOptions: ['', '', '', '', '', ''],
                                multipleSelect: false
                              }
                            });
                          }} />
                      )}
                    </div>
                  </AddQuestion>
                </div>
              )}
            />
          </FormGroup>
        )}
      </Formik>
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
