import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGOUT_FAIL,
  LOADING_LOGIN,
  CLEAR_ERRORS,
  LOGOUT_SUCCESS,
  TOKEN_EXPIRE
} from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('accessToken'),
  loading: false,
  errors: null,
  expire: false
};

const reducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      return {
        ...state,
        ...payload,
        loading: false,
        errors: null,
        expire: false,
      };
    case REGISTER_FAIL:
    case TOKEN_EXPIRE:
      return {
        ...state,
        expire: true
      };
    case LOGIN_FAIL:
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return {
        ...state,
        token: null,
        loading: false,
        errors: payload,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return {
        ...state,
        loading: false,
        errors: null,
        token: null,
        expire: true
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        token: localStorage.getItem('accessToken'),
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
