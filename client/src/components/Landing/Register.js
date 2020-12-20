import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import { registerUser } from '../../store/actions/auth';

const Register = ({ changeLoginForm, registerUser }) => {
  const [name, changeName] = useState('');
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');

  const submitForm = (e) => {
    console.log('In Func');
    registerUser({ name, email, password });
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Register
        </Header>
        <Form size="large" onSubmit={(e) => submitForm(e)}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Name"
              onChange={(e) => {
                changeName(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(e) => {
                changeEmail(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                changePassword(e.target.value);
              }}
            />

            <Button color="teal" fluid size="large">
              Register
            </Button>
          </Segment>
        </Form>
        <Message floating>
          <strong>
            Already a user?{' '}
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => changeLoginForm(true)}
            >
              Login
            </a>{' '}
          </strong>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default connect(null, { registerUser })(Register);
