import React, { useState } from 'react';
import { connect } from 'react-redux';
import { loginUser, clearLoginErrors } from '../../store/actions/auth';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';

const Login = ({
  changeLoginForm,
  loginUser,
  loading,
  errors,
  clearLoginErrors,
}) => {
  const [loginForm, updateLoginForm] = useState({});

  const submitLogin = () => {
    loginUser(loginForm);
  };

  const changeForm = () => {
    clearLoginErrors();
    updateLoginForm({});
    changeLoginForm(false);
  };

  const onFormValueChange = (event, result) => {
    const { name, value } = result || event.target;

    if (value === '') {
      let formData = { ...loginForm };
      delete formData[name];

      updateLoginForm({ ...formData });
    } else {
      updateLoginForm({ ...loginForm, [name]: value });
    }
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Login to Account
        </Header>
        <Form size="large" onSubmit={() => submitLogin()} loading={loading}>
          {errors !== null && (
            <Message
              visible={errors !== null}
              negative
              header="There was some errors with your submission"
              list={errors}
            />
          )}
          <Segment stacked>
            <Form.Input
              fluid
              name="email"
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={onFormValueChange}
            />
            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={onFormValueChange}
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
            <a style={{ cursor: 'pointer' }} onClick={() => changeForm(false)}>
              Register
            </a>{' '}
          </strong>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default connect(null, { loginUser, clearLoginErrors })(Login);
