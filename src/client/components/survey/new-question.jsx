import React from 'react';
import { Container, TextField, Box, FormControlLabel } from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  questionName: yup.string().required()
});

export default function NewQuestion(props) {
  const { index, handleQuestionFieldChange } = props;

  return (
    <Formik
      initialValues={{
        questionName: '',
        questionType: 'mult-choice',
        numOptions: 1
      }}
      validationSchema={validationSchema}
    >
      {({ values, handleChange }) => {
        return (
          <FormGroup onChange={e => {
            console.log(values); // values do not represent the values one screen
            handleQuestionFieldChange(index, values);
          }}>
            <QuestionLabel name="questionName">{index + 1}. </QuestionLabel >
            <InputField
              name="questionName"
              placeholder="ex: How satisfied were you with your experience?"
            />
            <QuestionTypes>
              <input type="radio" name="questionType" value="mult-choice" checked={values.questionType === 'mult-choice'} onChange={handleChange}/> Multiple Choice
              <input type="radio" name="questionType" value="free-text" checked={values.questionType === 'free-text'} onChange={handleChange}/> Free Text
            </QuestionTypes>
            <OptionsContainer>
              {values.questionType === 'mult-choice' ? (
                <Field
                  name="numOptions"
                  type="number"
                  placeholder="1-5"
                />
              ) : (
                <div>
                  Free text
                </div>
              )}
            </OptionsContainer>
          </FormGroup>
        );
      }}
    </Formik>
  );
}

const OptionsContainer = styled.span`

`;

const QuestionTypes = styled.div`
  margin-top: .5rem;
`;

const QuestionLabel = styled.label`
  font-size: 1.2rem;
  margin: .8rem 1rem .5rem 0;
  /* margin-right: 1rem;
  margin-bottom: .5rem; */
`;

const FormGroup = styled(Form)`
  width: 100%;
`;

const InputLabel = styled.label`
  margin-right: 1rem;
`;

const InputField = styled(Field)`
  width: 70%;
  font-size: 1rem;
  height: 2.5rem;
  border: none;
  border-bottom: 1px solid black;
`;
