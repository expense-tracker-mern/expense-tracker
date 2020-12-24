import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOADING_LOGIN,
  CLEAR_ERRORS,
} from './actionTypes';
import setAuthToken from '../utils/setAuthToken';

import axios from 'axios';

export const setUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
};

// Register New User
export const registerUser = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: LOADING_LOGIN,
    });
    const res = await axios.post('/api/auth/register', formData);
    dispatch({
      type: REGISTER_SUCCESS,
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
      type: REGISTER_FAIL,
      payload: errorsList,
    });
  }
};

// Login User
export const loginUser = (formData) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_LOGIN });
    console.log(formData);
    const res = await axios.post('/api/auth/login', formData);
    console.log(res.data);
    dispatch({
      type: LOGIN_SUCCESS,
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
      type: LOGIN_FAIL,
      payload: errorsList,
    });
  }
};

export const logoutUser = () => async (dispatch) => {
  dispatch({
    type: LOGOUT_USER,
  });
};

export const clearLoginErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
