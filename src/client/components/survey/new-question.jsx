import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import styled from 'styled-components';

export default function NewQuestion(props) {
  const { index, arrayHelpers, question } = props;

  return (
    <>
      <Label htmlFor={`questions.${index}.questionName`}>{index + 1}.</Label>
      <InputField
        name={`questions.${index}.questionName`}
        placeholder="ex: How satisfied were you with your shopping experience?"
      />
      <ErrorLabel name={`questions.${index}.questionName`}/>
      <DeleteButton>
        <DeleteOutlineIcon />
      </DeleteButton>
      <div>
        <RadioSwitches>
          <Field type="radio" name={`questions.${index}.questionType`} value="mult-choice" /> Multiple Choice
          <Field type="radio" name={`questions.${index}.questionType`} value="free-text" /> Free Text
        </RadioSwitches>
        {
          question.questionType === 'mult-choice' ? (
            <Field type="number" name={`questions.${index}.options.numQuestions`} />
          ) : (
            <span>
                Users will be give a text field to respond to your question.
            </span>
          )
        }
      </div>
    </>
  );
}

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  color: red;
`;

const RadioSwitches = styled.span`
  margin-right: 1rem;
`;

const Label = styled.label`
  display: inline-block;
  margin-right: 1rem;
`;

const InputField = styled(Field)`
  width: 70%;
  font-size: 1rem;
  height: 2.5rem;
  padding: .2rem;
  margin-bottom: 1rem;
  border: none;
  border-bottom: 1px solid black;
`;

const DeleteButton = styled.span`
  margin-left: 1rem;
`;
