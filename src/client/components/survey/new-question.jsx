import React from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray, FastField } from 'formik';
import { Divider } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import styled from 'styled-components';

export default function NewQuestion(props) {
  const { index, arrayHelpers, question, setFieldValue } = props;

  const resize = (arr, newSize) => {
    return [...arr, ...Array(Math.max(newSize - arr.length, 0)).fill('')];
  };

  return (
    <>
      <QuestionContainer>
        <Label htmlFor={`questions.${index}.questionName`}>{index + 1}.</Label>
        <InputField
          name={`questions.${index}.questionName`}
          placeholder="ex: How satisfied were you with your shopping experience?"
        />
        <ErrorLabel name={`questions.${index}.questionName`} component="div"/>
        <DeleteButton
          onClick={() => {
            arrayHelpers.remove(index);
          }}
        >
          <DeleteOutlineIcon />
        </DeleteButton>
        <RelDiv>
          <RadioSwitches>
            <Field type="radio" name={`questions.${index}.questionType`} value="mult-choice" /> Multiple Choice
            <Field type="radio" name={`questions.${index}.questionType`} value="free-text" /> Free Text
          </RadioSwitches>
          {
            question.questionType === 'mult-choice' ? (
              <>
              <Label>
                Number of Options (2 - 6)
              </Label>
                <FastField
                  type="number"
                  min="2"
                  max="6"
                  name={`questions.${index}.options.numOptions`}
                />
              <NumOptionsError
                name={`questions.${index}.options.numOptions`}
                component="div"
              />
              <QuestionOptions>
                {(question.options.numOptions < 7 && question.options.numOptions > 1) ? (
                  Array.from({ length: question.options.numOptions }, (_, k) => (
                    <QuestionOptionItem key={k}>
                      {k + 1}. <MultChoiceField
                        type="text"
                        name={`questions.${index}.options.answerOptions.${k}`}
                      />
                      <NumOptionsError name={`questions.${index}.options.answerOptions.${k}`} component="div"/>
                    </QuestionOptionItem>
                  ))
                )
                  : (
                    <div>
                      Invalid Number of Questions
                    </div>
                  )
                }
              </QuestionOptions>
              </>
            ) : (
              <span>
                  Users will be given a text field to respond to your question.
              </span>
            )
          }
        </RelDiv>
      </QuestionContainer>
      <Divider />
    </>
  );
}

const MultChoiceField = styled(FastField)`
  max-width: 350px;
  width: 100%;
`;

const QuestionContainer = styled.div`
  position: relative;
  padding: .5rem;
`;

const QuestionOptionItem = styled.div`
  margin: .3rem 0;
`;

const QuestionOptions = styled.div`
  position: relative;
  margin: .5rem 0;
`;

const RelDiv = styled.div`
  position: relative;
`;

const NumOptionsError = styled(ErrorMessage)`
  color: red;
  display: inline-block
  position: relative;
  margin-left: 1rem;
  font-size: .8rem;
`;

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  position: absolute;
  top: 3.5rem;
  left: 1.7rem;
  color: red;
`;

const RadioSwitches = styled.span`
  margin-right: 1rem;
`;

const Label = styled.label`
  display: inline-block;
  margin-right: 1rem;
`;

const InputField = styled(FastField)`
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
