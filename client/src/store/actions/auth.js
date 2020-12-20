import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
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
    const res = await axios.post('/api/auth/register', formData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(setUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((err) => {
        console.log(err.msg);
      });
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const loginUser = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/login', formData);
    console.log(res.data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(setUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => {
        console.log(err.msg);
      });
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
