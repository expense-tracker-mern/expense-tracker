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
  invoiceModalOpen: false,
  invoiceFile: null,
  fileType: null,
  transaction: null,
  mode: 'add',
  prevTransaction: {},
  uploaded: false
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
        uploaded: false
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
    case actionTypes.TRANSACTION_EDIT_ERROR:
      return {
        ...state,
        transactionSubmitError: action.payload,
        transactionModalLoading: false,
        submitSuccess: false,
      };
    case actionTypes.TRANSACTION_SUBMIT_LOADING:
    case actionTypes.TRANSACTION_EDIT_LOADING:
      return { ...state, transactionModalLoading: true };
    case actionTypes.TRANSACTION_SUBMIT_SUCCESS:
    case actionTypes.TRANSACTION_EDIT_SUCCESS:
      return {
        ...state,
        transactionModalLoading: false,
        transactionSubmitError: null,
        submitSuccess: true,
      };
    case actionTypes.UPLOAD_RECEIPT:
      return {
        ...state, uploaded : true
      }
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
    case actionTypes.OPEN_DELETE_MODAL:
      return {
        ...state,
        modalOpen: true,
        transactionModalLoading: false,
        mode: 'delete',
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
    case actionTypes.SHOW_INVOICE:
      return {
        ...state,
        invoiceModalOpen: true,
        invoiceFile: action.payload.file,
        fileType: action.payload.type,
        transaction: action.payload.transaction,
      };
    case actionTypes.CLOSE_INVOICE:
      return {
        ...state,
        invoiceModalOpen: false,
        invoiceFile: null,
        fileType: null,
      };
    default:
      return state;
  }
};

export default reducer;
