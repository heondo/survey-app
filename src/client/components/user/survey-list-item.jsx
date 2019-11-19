import React, { useState } from 'react';
import { makeStyles, Divider, Button, Modal } from '@material-ui/core';
import styled from 'styled-components';
import moment from 'moment';

export default function SurveyListItem(props) {
  const { survey } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  const getSurveyLink = () => {
    const str = `${survey.survey_name}_${survey.id}`;
    const b64URL = window.btoa(str);
    setModalText(`https://localhost:5000/surveys/take?identifier=${b64URL}`);
    setModalOpen(true);
  };

  return (
    <UserSurveyContainer>
      <SurveyName>
        <span style={{ textDecoration: 'underline' }}>
          {survey.survey_name}
        </span>
        <DateCreated>
          {`- `}Created {moment(survey.date_created).calendar().toLowerCase()}
        </DateCreated>
      </SurveyName>
      <div>
        {survey.num_questions} Questions
      </div>
      <ShareViewButtons>
        <Button variant="contained" style={{ marginRight: '.5rem' }}
          onClick={() => {
            const str = `${survey.survey_name}_${survey.id}`;
            const b64URL = window.btoa(str);
            props.history.push(`/surveys/take?identifier=${b64URL}`);
          }}
        >
          Share
        </Button>
        <Button
          variant="contained"
          onClick={getSurveyLink}
        >
          View Results
        </Button>
      </ShareViewButtons>
      <Divider style={{ marginTop: '1rem' }}/>
      <EditDeleteButtons>
        Edit and Delete Buttons
      </EditDeleteButtons>
      <Modal
        onClose={() => {
          setModalOpen(false);
        }}
        open={modalOpen}
      >
        <div style={{
          backgroundColor: 'white',
          position: 'absolute',
          padding: '.5rem',
          borderRadius: '5px',
          top: '50vh',
          left: '25%',
          width: '50%'
        }}>
          Share this URL for others to view and take your survey<br />
          {modalText}
        </div>
      </Modal>
      {/* <Modal open={modalOpen}>...</Modal> */}
    </UserSurveyContainer>
  );
}

const ShareViewButtons = styled.div`
  display: flex;
  justify-content: right;
`;

const EditDeleteButtons = styled.div`
  position: absolute;
  display: none;
  top: .3rem;
  right: 0;
`;

const UserSurveyContainer = styled.div`
  padding: .3rem;
  margin: 0 0 1rem 0;
  position: relative;
  &:hover ${EditDeleteButtons} {
    display: block;
  }
`;

const SurveyName = styled.div`
  font-size: 1.3rem;
`;

const DateCreated = styled.span`
  font-size: 1rem;
  margin: 0 0 0 .5rem;
`;
