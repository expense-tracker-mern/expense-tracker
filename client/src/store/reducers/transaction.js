import * as actionTypes from '../actions/actionTypes';

const initialState = {
  transactionLoadError: null,
  transactionSubmitError: null,
  transactions: null,
  loading: true,
  total: 0,
  income: 0,
  expenses: 0,
  amount: [],
  categories: [],
  types: [],
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TRANSACTIONS:
      return {
        ...state,
        transactionLoadError: [],
        transactions: action.transactions,
        total: action.total,
        income: action.income,
        expenses: action.expenses,
        loading: action.loading,
        categories: action.categories,
      };
    case actionTypes.GET_TRANSACTIONS_FAIL:
      return {
        ...state,
        transactionLoadError: action.error,
        loading: action.loading,
      };
    case actionTypes.TRANSACTION_TYPE_LOADED:
      return { ...state, types: action.payload };
    case actionTypes.TRANSACTION_TYPE_ERROR:
      return { ...state, types: [] };
    case actionTypes.TRANSACTION_CATEGORY_LOADED:
      return { ...state, categories: action.payload };
    case actionTypes.TRANSACTION_CATEGORY_ERROR:
      return { ...state, categories: [], loading: false };
    case actionTypes.TRANSACTION_SUBMIT_ERROR:
      return {
        ...state,
        transactionSubmitError: action.payload,
        loading: false,
      };
    case actionTypes.TRANSACTION_SUBMIT_LOADING:
      return { ...state, loading: true };
    case actionTypes.TRANSACTION_SUBMIT_SUCCESS:
      return { ...state, loading: false, transactionSubmitError: null };
    default:
      return state;
  }
};

export default reducer;
