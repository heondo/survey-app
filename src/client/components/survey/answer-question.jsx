import React from 'react';
import styled from 'styled-components';
import { Field } from 'formik';

export default function AnswerQuestion(props) {
  const { question, index, value } = props;
  const { question_name: questionName, options, question_id: questionID, question_type: questionType } = question;

  const FreeChoice = () => (
    <div>
      <Field
        placeholder="Your response"
        name={`questions.${index}`}
        onChange={e => {
          console.log(e.target.value);
        }}
      />
    </div>
  );

  const MultChoice = () => (
    <div>
      {options.answerOptions.map((o, i) => {
        if (o) {
          return (
            <div key={i}>
              <Field
                type="radio"
                value={o}
                name={`questions.${index}`}
              />
              {o}
            </div>
          );
        }
      })}
    </div>
  );

  return (
    <QuestionContainer>
      <div>
        {index + 1}. {questionName}
      </div>
      {
        questionType === 'free-text' ? (
          <FreeChoice />
        ) : (
          <MultChoice />
        )
      }
    </QuestionContainer>
  );
}
const QuestionContainer = styled.div`
  position: relative;
`;
