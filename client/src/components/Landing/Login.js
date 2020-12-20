import React, { useState } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../store/actions/auth';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';

const Login = ({ changeLoginForm, loginUser }) => {
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');

  const submitLogin = () => {
    loginUser({ email, password });
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Login to Account
        </Header>
        <Form size="large" onSubmit={() => submitLogin()}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(e) => updateEmail(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => updatePassword(e.target.value)}
            />

            <Button
              color="teal"
              fluid
              size="large"
              onClick={() => submitLogin()}
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          <strong>
            New to us?{' '}
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => changeLoginForm(false)}
            >
              Login
            </a>{' '}
          </strong>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default connect(null, { loginUser })(Login);
