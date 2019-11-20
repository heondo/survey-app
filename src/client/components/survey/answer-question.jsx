import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Field } from 'formik';

export default function AnswerQuestion(props) {
  const { question, index, value, handleChange, setFieldValue } = props;
  const { question_name: questionName, options, question_id: questionID, question_type: questionType } = question;

  useEffect(() => {
  }, []);

  const FreeChoice = () => {
    return (
      <div>
        <FreeInput
          component="textarea"
          placeholder="Your response"
          name={`questions.${index}`}
          rows="3"
        />
      </div>
    );
  };

  const MultChoice = () => {
    let optionsArray = [];
    options.answerOptions.forEach((o, i) => {
      if (o) {
        optionsArray.push(o);
      }
    });
    return (
      <div>
        {
          optionsArray.map((o, i) => (
            <div key={i}>
              <Field
                checked={ value === o }
                key={i}
                onChange={handleChange}
                type="radio"
                value={o}
                name={`questions.${index}`}
              />
              {o}
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <QuestionContainer>
      <div>
        {index + 1}. {questionName}
      </div>
      {
        questionType === 'free-text'
          ? FreeChoice()
          : MultChoice()
      }
    </QuestionContainer>
  );
}
const QuestionContainer = styled.div`
  position: relative;
  margin: .5rem 0;
`;

const FreeInput = styled(Field)`
  width: 100%;
`;
