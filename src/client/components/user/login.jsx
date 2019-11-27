import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
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

const GetStartedText = styled.div`
  font-size: 1rem;
  margin-top: 1rem;
`;

const InputField = styled(Field)`
  width: 100%;
  height: 2rem;
  border-radius: 3px;
`;

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  position: absolute;
  margin-top: 3px;
  color: red;
`;

const FailedLogin = styled.div`
  font-size: .8rem;
  position: absolute;
  margin-top: 3px;
  color: red;
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

const LoginButtonContainer = styled(ErrorInputContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LoginButton = styled(Button)`
  background-color: darkgrey;
`;

const SignupOption = styled(Link)`
  font-size: .8rem;
  color: black;
  font-style: italic;
  text-decoration: underline;
`;

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid Email').required('Required'),
  password: yup.string().required("Can't login without a password")
});

export default function Login(props) {
  const { setUserInfo } = props;
  const [loginFailed, setLoginFailed] = useState(false);

  const handleLogin = values => {
    // send someting to the backend
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          if (res.error === 'Authorization Failed') {
            setLoginFailed(true);
          }
          throw new Error(res.error);
        }
        window.localStorage.setItem('token', res.token);
        window.localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
        setUserInfo(res.userInfo);
        // now you have the token back
      })
      .catch(err => console.error(err));
  };

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
        onSubmit={handleLogin}
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
                type="password"
                placeholder="*********"
                name="password"
                value={props.values.password}
              />
              <ErrorLabel name="password" component="div" />
              {loginFailed ? (
                <FailedLogin>
                Failed Login
                </FailedLogin>
              ) : undefined}
            </ErrorInputContainer>
            <LoginButtonContainer>
              <LoginButton type="submit" variant="contained">
                LOG IN
              </LoginButton>
              <SignupOption to="/signup">
                No account? Register here
              </SignupOption>
            </LoginButtonContainer>
          </FormGroup>
        )}
      </Formik>
    </Container>
  );
}
