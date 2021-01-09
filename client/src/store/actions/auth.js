import setAuthToken from '../utils/setAuthToken';
import * as actionTypes from './actionTypes';

import axios from 'axios';

export const setUser = () => async (dispatch) => {
  if (localStorage.accessToken) {
    setAuthToken(localStorage.accessToken);
  }
};

// Register New User
export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LOADING_LOGIN,
    });
    const res = await axios.post('/api/auth/register', formData);
    dispatch({
      type: actionTypes.REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setUser());
  } catch (err) {
    const errors = err.response.data.errors;
    let errorsList = [];
    if (errors) {
      errors.forEach((err) => {
        errorsList.push(err.msg);
      });
    }

    dispatch({
      type: actionTypes.REGISTER_FAIL,
      payload: errorsList,
    });
  }
};

// Login User
export const loginUser = (formData) => async (dispatch) => {
  try {
    console.log('Login');
    dispatch({ type: actionTypes.LOADING_LOGIN });
    console.log(formData);
    const res = await axios.post('/api/auth/login', formData);
    console.log(res.data);
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(setUser());
  } catch (error) {
    const errors = error.response.data.errors;
    let errorsList = [];
    if (errors) {
      errors.forEach((err) => {
        errorsList.push(err.msg);
      });
    }

    console.log(errorsList);
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      payload: errorsList,
    });
  }
};

//logout user
export const logout = () => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.LOGOUT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: actionTypes.LOGOUT_FAIL,
    });
  }
};

export const clearLoginErrors = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_ERRORS,
  });
};

// Refresh Token
export const refreshToken = (token) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/refresh-token', {"token" :token});
    if(res.data.name === "TokenExpiredError"){
      // dispatch({
      //   type: actionTypes.TOKEN_EXPIRE,
      // });
      dispatch({
        type: actionTypes.LOGOUT_SUCCESS,
      });
    }else{
      setAuthToken(res.data.accessToken);
      localStorage.setItem("accessToken",res.data.accessToken);
    }
  } catch (error) {   
    console.log(error.response);
  }
};
