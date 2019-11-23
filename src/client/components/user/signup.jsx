import React, { useState } from 'react';
import { Container, Button } from '@material-ui/core';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

function equalTo(ref, msg) {
  return yup.mixed().test({
    name: 'equalTo',
    exclusive: false,
    message: msg,
    params: {
      reference: ref.path
    },
    test: function (value) {
      return value === this.resolve(ref);
    }
  });
}
yup.addMethod(yup.string, 'equalTo', equalTo);

const validationSchema = yup.object().shape({
  first: yup.string().max(32, 'Limit to 32 characters').required('Field Required'),
  last: yup.string().max(32, 'Limit to 32 characters').required('Field Required'),
  email: yup.string().email('Please enter a valid email').required('Email required for sign in'),
  password: yup.string().max(32, 'Limit password to 32 characters').required('Password required'),
  confirmPassword: yup.string().equalTo(yup.ref('password'), 'Passwords must match')
});

export default function SignUp(props) {
  const { setUserInfo } = props;
  const [setupFailed, setSetupFailed] = useState(false);

  const submitSignup = values => {
    fetch('/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error);
        }
      })
      .catch(err => {
        if (err.message.match('users_email_key')) {
          setSetupFailed(true);
          setTimeout(() => setSetupFailed(false), 3000);
        }
        console.log(err);
      });
  };

  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ textAlign: 'center' }}>Create and Account</h1>
        <FormContainer>
          <Formik initialValues={{
            first: '',
            last: '',
            email: '',
            password: '',
            confirmPassword: ''
          }}
          onSubmit={submitSignup}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          >
            <Form>
              <RelDiv style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <InputField
                  name='first'
                  placeholder='First Name'
                />
                <ErrorLabel name='first' component="div"/>
                <InputField
                  name='last'
                  placeholder='Last Name'
                />
                <ErrorLabel name='last' component="div" style={{ left: '54%' }}/>
              </RelDiv>
              <RelDiv>
                <FullInput
                  name='email'
                  placeholder='Email'
                />
                <ErrorLabel name='email' component="div" />
              </RelDiv>
              <RelDiv>
                <FullInput
                  name='password'
                  placeholder='Password'
                />
                <ErrorLabel name='password' component="div" />

              </RelDiv>
              <RelDiv>
                <FullInput
                  name='confirmPassword'
                  placeholder='Confirm Password'
                />
                <ErrorLabel name='confirmPassword' component="div" />
              </RelDiv>
              <RelDiv>
                {setupFailed ? (
                  <div
                    style={{ position: 'absolute', top: '-10px', fontSize: '.8rem', color: 'red' }}>
                    Email Unavailable
                  </div>
                ) : null}
                <Button type="submit" variant="contained" style={{ marginTop: '.4rem' }}>
                  Submit
                </Button>
              </RelDiv>
            </Form>
          </Formik>
        </FormContainer>
      </div>
    </Container>
  );
}

const RelDiv = styled.div`
  position: relative;
`;
const FormContainer = styled.div`
  width: 60%;
  margin: 0 auto;
`;

const FullInput = styled(Field)`
  margin: .7rem 0;
  width: 99%;
  height: 2rem;
  border-radius: 3px;
`;

const InputField = styled(Field)`
  margin-top: .7rem;
  margin-bottom: .7rem;
  width: 45%;
  height: 2rem;
  border-radius: 3px;
`;

const ErrorLabel = styled(ErrorMessage)`
  font-size: .8rem;
  position: absolute;
  color: red;
  bottom: -4px;
`;
