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
import { registerUser, clearLoginErrors } from '../../store/actions/auth';

const Register = ({
  changeLoginForm,
  registerUser,
  loading,
  errors,
  clearLoginErrors,
}) => {
  const [registerForm, updateRegisterForm] = useState({});

  const submitForm = (e) => {
    registerUser(registerForm);
  };

  const changeForm = () => {
    clearLoginErrors();
    updateRegisterForm({});
    changeLoginForm(true);
  };

  const onFormValueChange = (event, result) => {
    const { name, value } = result || event.target;

    if (value === '') {
      let formData = { ...registerForm };
      delete formData[name];

      updateRegisterForm({ ...formData });
    } else {
      updateRegisterForm({ ...registerForm, [name]: value });
    }
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Register
        </Header>
        <Form size="large" onSubmit={(e) => submitForm(e)} loading={loading}>
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
              name="name"
              icon="address card"
              iconPosition="left"
              placeholder="Name"
              onChange={onFormValueChange}
            />
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

            <Button color="teal" fluid size="large">
              Register
            </Button>
          </Segment>
        </Form>
        <Message floating>
          <strong>
            Already a user?{' '}
            <a style={{ cursor: 'pointer' }} onClick={() => changeForm()}>
              Login
            </a>{' '}
          </strong>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default connect(null, { registerUser, clearLoginErrors })(Register);
