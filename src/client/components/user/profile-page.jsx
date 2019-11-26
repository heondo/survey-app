import React, { useState, useEffect } from 'react';
import { Container, Box } from '@material-ui/core';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LoadingCircle from '../helper/loading-circle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SurveyListItem from './survey-list-item';

export default function ProfilePage(props) {
  const { logout } = props;
  const [surveysLoaded, setSurveysLoaded] = useState(false);
  const [surveys, setSurveys] = useState([]);

  const getSurveys = () => {
    const token = window.localStorage.getItem('token');
    fetch('/api/users/surveys', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          if (res.error.message === 'Auth failed') {
            logout();
          }
          throw new Error(res.error);
        }
        setSurveys(res.surveys);
        setSurveysLoaded(true);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    // TODO call the function to get the array of surveys that the user has created.
    getSurveys();
  }, []);

  return (
    <Container>
      {surveysLoaded ? (
        <>
          <HeaderContainer>
            <Header>
              Surveys
            </Header>
            <BlackLink to="/create-survey">
              <AddSurveyText>
                NEW SURVEY +
              </AddSurveyText>
            </BlackLink>
          </HeaderContainer>
          <Div>
            {(surveys.length) ? (
              // TODO display surveys list
              surveys.map((survey, i) => (
                <SurveyListItem {...props} key={survey.id} survey={survey} setSurveysLoaded={setSurveysLoaded}/>
              ))
            ) : (
              <NoSurveys>
                <SubHeader>
                    You have no surveys
                </SubHeader>
                <BlackLink to="/create-survey">
                  <AddCircleIcon fontSize="large" style={{ margin: 'auto' }} />
                </BlackLink>
              </NoSurveys>
            )}
          </Div>
        </>
      )
        : <LoadingCircle />
      }
    </Container>
  );
}

const BlackLink = styled(Link)`
  color: black;
  text-decoration: none;
`;

const HeaderContainer = styled.div`
  position: relative;
  padding-top: 1rem;
`;

const Div = styled(Box)`
  position: relative;
  padding: .5rem;
`;

const NoSurveys = styled(Div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 2.5rem;
`;

const SubHeader = styled.div`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const AddSurveyText = styled.div`
  position: absolute;
  font-size: 1.5rem;
  right: 1rem;
  top: 2rem;
`;
