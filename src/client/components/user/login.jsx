import React from 'react';
import { Container, makeStyles, Input } from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
`;

const TitleText = styled.h1``;

const TitleSubText = styled.p``;

const GetStartedText = styled.h3`
  margin-top: 2rem;
`;

const InputField = styled(Field)`
  width: 100%;
  height: 2rem;
  border-radius: 3px;
`;

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  position: absolute;
`;

const FormGroup = styled(Form)`
position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorInputContainer = styled.div`
  position: relative;
  width: 80%;
  max-width: 450px;
  margin-bottom: 1.5rem;
`;

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid Email').required('Required'),
  password: yup.string().required()
});

export default function Login(props) {
  return (
    <Container position="relative">
      <HeaderContainer>
        <TitleText>
          Survey App
        </TitleText>
        <TitleSubText>
          Create your own surveys, share the link and view the results!
        </TitleSubText>
        <GetStartedText>
          Login to get started
        </GetStartedText>
      </HeaderContainer>
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={validationSchema}
      >
        {props => (
          <FormGroup>
            <ErrorInputContainer>
              <InputField
                id="email"
                label="Email Address"
                placeholder="johnsmith@example.com"
                name="email"
                value={props.values.email}
              />
              <ErrorLabel name="email" component="div" />
            </ErrorInputContainer>
            <ErrorInputContainer>
              <InputField
                id="password"
                label="password"
                placeholder="*********"
                name="password"
                value={props.values.password}
              />
              <ErrorLabel name="password" component="div" />
            </ErrorInputContainer>
          </FormGroup>
        )}
      </Formik>
    </Container>
  );
}
