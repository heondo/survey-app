import React, { useState, useEffect } from 'react';
import LoadingCircle from '../helper/loading-circle';
import { Container } from '@material-ui/core';
import querystring from 'querystring';

export default function TakeSurvey(props) {
  const [surveyLoaded, setSurveyLoaded] = useState(false);
  const [survey, setSurvey] = useState({});

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
        setSurveyLoaded(true);
      })
      .catch(err => console.error(err));
  };

  return surveyLoaded ? (
    <Container>
      {survey.question_array.map(q => (
        <div>
          New Question
        </div>
      ))}
    </Container>
  ) : (
    <LoadingCircle />
  );
}
