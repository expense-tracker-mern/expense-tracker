import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { connect } from 'react-redux';

const Landing = ({ isAuthenticated }) => {
  console.log(localStorage.token);
  const [isLoginForm, changeLoginForm] = useState(true);

  return (
    localStorage.token ?
      <Redirect to="/dashboard" /> :
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
