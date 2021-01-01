import * as actionTypes from '../actions/actionTypes';

const initialState = {
  transactionLoadError: null,
  transactionSubmitError: null,
  transactions: null,
  transactionListLoading: false,
  transactionModalLoading: false,
  total: 0,
  income: 0,
  expenses: 0,
  amount: [],
  incomeCategories: [],
  expenseCategories: [],
  types: [],
  submitSuccess: false,
  modalOpen: false,
  mode: 'add',
  prevTransaction: {},
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
        transactionListLoading: false,
        incomeCategories: action.incomeCategories,
        expenseCategories: action.expenseCategories,
        amount: action.amount,
      };
    case actionTypes.GET_TRANSACTIONS_FAIL:
      return {
        ...state,
        transactionLoadError: action.error,
        transactionListLoading: false,
      };
    case actionTypes.GET_TRANSACTIONS_LOADING:
      return { ...state, transactionListLoading: true };
    case actionTypes.TRANSACTION_TYPE_LOADED:
      return { ...state, types: action.payload };
    case actionTypes.TRANSACTION_TYPE_ERROR:
      return { ...state, types: [] };
    case actionTypes.TRANSACTION_CATEGORY_LOADED:
      return {
        ...state,
        categories: action.payload,
        transactionModalLoading: false,
      };
    case actionTypes.TRANSACTION_CATEGORY_ERROR:
      return { ...state, categories: [], transactionModalLoading: false };
    case actionTypes.TRANSACTION_SUBMIT_ERROR:
      return {
        ...state,
        transactionSubmitError: action.payload,
        transactionModalLoading: false,
        submitSuccess: false,
      };
    case actionTypes.TRANSACTION_SUBMIT_LOADING:
      return { ...state, transactionModalLoading: true };
    case actionTypes.TRANSACTION_SUBMIT_SUCCESS:
      return {
        ...state,
        transactionModalLoading: false,
        transactionSubmitError: null,
        submitSuccess: true,
      };
    case actionTypes.OPEN_ADD_MODAL:
      return {
        ...state,
        transactionSubmitError: null,
        transactionModalLoading: false,
        modalOpen: true,
        mode: 'add',
      };
    case actionTypes.OPEN_EDIT_MODAL:
      return {
        ...state,
        modalOpen: true,
        transactionModalLoading: false,
        mode: 'edit',
        prevTransaction: action.payload,
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        transactionSubmitError: null,
        modalOpen: false,
        transactionModalLoading: false,
        prevTransaction: {},
      };
    default:
      return state;
  }
};

export default reducer;
