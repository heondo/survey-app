import React, { useState } from 'react';
import { Container, TextField, Box } from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import update from 'immutability-helper';
import NewQuestion from './new-question';

import * as yup from 'yup';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import styled from 'styled-components';

// import { Formik, Form, Field, ErrorMessage } from 'formik';

const validationSchema = yup.object().shape({
  surveyName: yup.string().required('Survey name required')
});

export default function CreateSurvey(props) {
  const [questions, setQuestions] = useState([{}]);

  const addNewQuestion = () => {
    setQuestions(update(questions, { $push: [{}] }));
  };

  const handleQuestionFieldChange = (index, questionFields) => {
    setQuestions(update(questions, {
      [index]: { $set: questionFields }
    }));
  };

  return (
    <Container>
      <h2>Create Survey</h2>
      <Formik
        initialValues={{
          surveyName: ''
        }}
        validationSchema={validationSchema}
      >
        {props => (
          <Form>
            <label htmlFor="surveyName">Survey Name</label>
            <InputField
              id="surveyName"
              name="surveyName"
              placeholder="My very own survey"
            >
            </InputField>
            <ErrorLabel name="surveyName" />
          </Form>
        )}
      </Formik>
      {
        (questions.length) ? (
          // TODO render out the questions
          questions.map((q, i) => (
            <NewQuestion key={i} index={i} handleQuestionFieldChange={handleQuestionFieldChange}/>
          ))
        ) : (
          <NoQuestions>You have no questions</NoQuestions>
        )
      }
      <AddQuestion>
        <SubHeader>
          New Question
        </SubHeader>
        <div>
          <AddCircleIcon fontSize="large" style={{ margin: 'auto' }} onClick={addNewQuestion} />
        </div>
      </AddQuestion>
    </Container>
  );
}

const InputField = styled(Field)`
  width: 100%;
  font-size: 1rem;
  height: 2.5rem;
  margin-bottom: 1rem;
  border: none;
  border-bottom: 1px solid black;
`;

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  position: absolute;
  margin-top: 3px;
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
