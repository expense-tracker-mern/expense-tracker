import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { connect } from 'react-redux';

const Landing = ({ isAuthenticated }) => {
  const [isLoginForm, changeLoginForm] = useState(true);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      {isLoginForm ? (
        <Login changeLoginForm={changeLoginForm} />
      ) : (
        <Register changeLoginForm={changeLoginForm} />
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Landing);
