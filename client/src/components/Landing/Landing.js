import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { connect } from 'react-redux';

const Landing = ({ isAuthenticated, loading, errors }) => {
  const [isLoginForm, changeLoginForm] = useState(true);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
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
