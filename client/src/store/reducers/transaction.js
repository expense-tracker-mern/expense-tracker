import * as actionTypes from '../actions/actionTypes';

const initialState = {
  error: null,
  transactions: null,
  loading: true,
  total: 0,
  income: 0,
  expenses: 0,
  amount: [],
  incomeCategories: [],
  expenseCategories: [],
  types: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TRANSACTIONS:
      return {
        ...state,
        error: [],
        transactions: action.transactions,
        total: action.total,
        income: action.income,
        expenses: action.expenses,
        loading: action.loading,
        incomeCategories: action.incomeCategories,
        expenseCategories: action.expenseCategories,
        amount: action.amount,
      }
    case actionTypes.GET_TRANSACTIONS_FAIL:
      return {
        ...state,
        error: action.error,
        loading: action.loading
      }
    case actionTypes.TRANSACTION_TYPE_LOADED:
      return { ...state, types: action.payload };
    case actionTypes.TRANSACTION_TYPE_ERROR:
      return { ...state, types: [] };
    case actionTypes.TRANSACTION_CATEGORY_LOADED:
      return { ...state, categories: action.payload };
    case actionTypes.TRANSACTION_CATEGORY_ERROR:
      return { ...state, categories: [] };
    default:
      return state;
  }
}

export default reducer;
