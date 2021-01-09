import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { connect } from 'react-redux';

const Landing = ({ loading, errors, isAuthenticated }) => {
  const [isLoginForm, changeLoginForm] = useState(true);
  return localStorage.accessToken ? (
    <Redirect to="/dashboard" />
  ) : (
    <Fragment>
      {isLoginForm ? (
        <Login
          changeLoginForm={changeLoginForm}
          loading={loading}
          errors={errors}
        />
      ) : (
        <Register
          changeLoginForm={changeLoginForm}
          loading={loading}
          errors={errors}
        />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  errors: state.auth.errors,
});

export default connect(mapStateToProps, {})(Landing);
