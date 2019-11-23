import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import moment from 'moment';
import styled from 'styled-components';
import LoadingCircle from '../helper/loading-circle';
import SurveyPlot from './survey-plot';

export default function ViewResults(props) {
  useEffect(() => {
    getSurveyResults();
  }, []);

  const [response, setResponse] = useState(null);

  const getSurveyResults = () => {
    const token = window.localStorage.getItem('token');
    const surveyID = props.match.params.id;
    fetch(`/api/surveys/results/${surveyID}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error);
        }
        const { responses, responseCount, answerCounts, chartResponse } = res;
        setResponse({ responses, responseCount, answerCounts, chartResponse });
        // setResponse(res.responses);
      })
      .catch(err => console.error(err));
  };

  return response ? (
    <Container>
      <h4>{response.responses[0].survey_name}</h4>
      <div>Created {moment(response.responses[0].survey_date).calendar()}</div>
      <div>With {response.responseCount} responses so far</div>
      <SurveyPlot response={response}/>
      {response.responseCount ? (
        <>
          <div>Multiple Choice Questions</div>
          <MultipleChoicePercentages responseCount={response.responseCount} answerCounts={response.answerCounts} />
          <div>Free Response Questions</div>
          <FreeTextResponses responses={response.responses} />
        </>
      ) : (<div>No responses</div>)}

    </Container>
  ) : (
    <LoadingCircle />
  );
}

const FreeResponsesScroll = styled.div`
  overflow-y: scroll;
  max-height: 200px;
`;

function FreeTextResponses(props) {
  const { responses } = props;
  const [renderArray, setRenderArray] = useState(null);

  useEffect(() => {
    responsesScroll();
  }, []);

  const responsesScroll = () => {
    const freeTexts = responses.filter(q => q.question_info.questionType === 'free-text');
    const returnArray = freeTexts.map((q, i) => (
      <div key={i}>
        <QuestionName>
          {q.question_info.questionName}
        </QuestionName>
        <FreeResponsesScroll>
          {q.responses.map((r, i) => (
            <div key={i}>
              {i + 1}. {r.response}
            </div>
          ))}
        </FreeResponsesScroll>
      </div>
    ));

    setRenderArray(returnArray);
  };

  return (
    <div>
      {renderArray}
    </div>
  );
}

function MultipleChoicePercentages(props) {
  const { responseCount, answerCounts } = props;
  const [renderArrays, setRenderArrays] = useState(null);

  useEffect(() => {
    generateDivs();
  }, []);

  const generateDivs = () => {
    let returnArray = [];
    answerCounts.forEach((q, i) => {
      returnArray.push(
        <div key={i}>
          <QuestionName>{q.x}</QuestionName>
          <div style={{ display: 'flex' }}>
            <span style={{
              width: '125px',
              textOverflow: 'ellipse'
            }}>
              {Object.keys(q.results).map((key, i) => {
                return (
                  <div key={i}>{key}</div>
                );
              })}
            </span>
            <PercentagesContainer>
              {Object.values(q.results).map((val, i) => {
                const percent = ((val / responseCount) * 100).toFixed(1);
                const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                return (
                  <div
                    key={i}
                    style={{
                      border: '1px solid black',
                      backgroundColor: `${randomColor}`,
                      width: `${Math.floor(percent) * 2}px`
                      // background: 'linear-gradient(left, black 40%, white 60%)'
                    }}
                  >
                    <div style={{
                      marginLeft: `${Math.floor(percent) * 2 + 5}px`
                    }}>
                      {percent}%
                    </div>
                  </div>
                );
              })}
            </PercentagesContainer>
            <span style={{
              marginLeft: '40px',
              paddingTop: '3px'
            }}>
              {Object.values(q.results).map((val, i) => {
                return (
                  <div key={i}>{val}</div>
                );
              })}
            </span>
          </div>
        </div>
      );
    });
    setRenderArrays(returnArray);
  };

  return (
    <div>
      {renderArrays}
    </div>
  );
}

const QuestionName = styled.div`
  font-size: 1.2rem;
  text-decoration: underline;
  margin: .5rem 0;
`;

const PercentagesContainer = styled.span`
  width: 225px;
  margin: 0 1rem;
`;
