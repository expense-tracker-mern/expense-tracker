import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGOUT_FAIL,
  LOADING_LOGIN,
  CLEAR_ERRORS,
  LOGOUT_SUCCESS,
} from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  errors: null,
};

const reducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        errors: null,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        errors: payload,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        errors: null,
        token: null,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        isAuthenticated: true,
        token: localStorage.getItem('token'),
        loading: false,
        errors: null,
      };
    case LOADING_LOGIN:
      return { ...state, loading: true };
    case CLEAR_ERRORS:
      return { ...state, errors: null };
    default:
      return { ...state };
  }
};

export default reducer;
