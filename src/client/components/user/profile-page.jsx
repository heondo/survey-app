import React, { useState, useEffect } from 'react';
import { Container, Paper, Box } from '@material-ui/core';
import styled from 'styled-components';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function ProfilePage(props) {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    // TODO call the function to get the array of surveys that the user has created.
    // no surveys yet so lets focus on creating the single survey
  }, []);

  return (
    <Container>
      <Paper style={{ padding: '.5rem' }}>
        <Div>
          <Header>
            Surveys
          </Header>
          <AddSurveyText>
            NEW SURVEY +
          </AddSurveyText>
        </Div>
        <Div>
          {(surveys.length) ? (
            // TODO display surveys list
            <div>User Surveys hahaahaahaha</div>
          ) : (
            <NoSurveys>
              <SubHeader>
                You have no surveys
              </SubHeader>
              <div>
                <AddCircleIcon fontSize="large" style={{ margin: 'auto' }} />
              </div>
            </NoSurveys>
          )}
        </Div>
      </Paper>
    </Container>
  );
}

const Div = styled(Box)`
  position: relative;
  padding: .5rem;
  margin-top: 1rem;
`;

const NoSurveys = styled(Div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 3rem;
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
