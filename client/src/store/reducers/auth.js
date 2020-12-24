import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGOUT,
  LOGOUT_FAIL
} from '../actions/actionTypes';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
};

const reducer = (state = initialState, action) => {
  const { payload, type } = action;

  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, loading: false };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: localStorage.removeItem('token'),
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        isAuthenticated: true,
        token: localStorage.getItem('token'),
      }
    default:
      return { ...state };
  }
}

export default reducer;
