import * as actionTypes from './actionTypes';
import axios from 'axios';
import dateFormat from 'dateformat';
import setAuthToken from '../utils/setAuthToken';
import { refreshToken } from './auth';

// ****************
// Action to retrieve user transactions for specific month
// ****************
export const getTransactions = (date, type) => async (dispatch) => {
  try {
    setAuthToken(localStorage.accessToken);

    const transactions = await axios.get(
      'api/transaction/all-transactions/' + type + '/' + date
    );
    console.log(transactions);

    //Categories for pie charts
    let categories = Object.values(transactions.data).map((transaction) => ({
      name: transaction.category.name,
      type: transaction.type.name,
    }));
    var incomeCategoriesCount = {};
    var expenseCategoriesCount = {};
    var incomeCount = 0,
      expenseCount = 0;

    var incomeCategories = categories.filter((i) => {
      return i.type === 'Income';
    });
    incomeCategories.forEach((i) => {
      incomeCount++;
      incomeCategoriesCount[i.name] = (incomeCategoriesCount[i.name] || 0) + 1;
    });
    for (var key in incomeCategoriesCount) {
      if (incomeCategoriesCount.hasOwnProperty(key)) {
        incomeCategoriesCount[key] = (
          (incomeCategoriesCount[key] / incomeCount) *
          100
        ).toFixed(2);
      }
    }

    var expenseCategories = categories.filter((i) => {
      return i.type === 'Expense';
    });
    expenseCategories.forEach((i) => {
      expenseCount++;
      expenseCategoriesCount[i.name] =
        (expenseCategoriesCount[i.name] || 0) + 1;
    });
    for (var k in expenseCategoriesCount) {
      if (expenseCategoriesCount.hasOwnProperty(k)) {
        expenseCategoriesCount[k] = (
          (expenseCategoriesCount[k] / expenseCount) *
          100
        ).toFixed(2);
      }
    }
    //Transaction amounts for bar chart
    let dates = Object.values(transactions.data).map((transaction) => ({
      date:
        type === 'month'
          ? dateFormat(transaction.date, 'd')
          : dateFormat(transaction.date, 'mmmm'),
      amount: transaction.amount,
      type: transaction.type.name,
    }));

    var list = [];
    var years = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    if (type === 'year') {
      years.forEach((i) => {
        if (!dates.some((item) => item.date === i.toString())) {
          dates.push({ date: i, amount: 0, expense: 'Income' });
        }
      });
      dates.sort((a, b) => {
        return years.indexOf(a.date) - years.indexOf(b.date);
      });
    } else {
      for (var i = 1; i < 32; i++) {
        list.push(i);
      }
      list.forEach((i) => {
        if (!dates.some((item) => item.date === i.toString())) {
          dates.push({ date: i, amount: 0, expense: 'Income' });
        }
      });
    }
    var amount = {};

    dates.forEach((i) => {
      i.type === 'Income'
        ? (amount[i.date] = (amount[i.date] || 0) + i.amount)
        : (amount[i.date] = (amount[i.date] || 0) - i.amount);
    });

    var total = 0,
      income = 0,
      expenses = 0;
    transactions.data.map((t) => {
      if (t.type.name === 'Expense') {
        return [(total = total - t.amount), (expenses = expenses + t.amount)];
      } else {
        return [(total = total + t.amount), (income = income + t.amount)];
      }
    });

    dispatch({
      type: actionTypes.GET_TRANSACTIONS,
      transactions: transactions.data,
      total: total,
      income: income,
      expenses: expenses,
      incomeCategories: incomeCategoriesCount,
      expenseCategories: expenseCategoriesCount,
      amount: amount,
    });
  } catch (error) {
    console.log(error.response.status);
    if (error.response.status === 401) {
      dispatch(refreshToken(localStorage.refreshToken));
    }
    dispatch({
      type: actionTypes.GET_TRANSACTIONS_FAIL,
      error: error,
    });
  }
};

// ****************
// Action to retrieve transaction Types
// ****************
export const getTransactionTypes = () => async (dispatch) => {
  setAuthToken(localStorage.accessToken);
  try {
    const res = await axios.get('/api/transaction-type/all');
    let transactionTypeOptions = [];
    console.log(res.data);

    res.data.forEach((option) => {
      let optionBody = {};
      optionBody.key = 'type_' + option.name;
      optionBody.text = option.name;
      optionBody.value = option.name;
      transactionTypeOptions.push(optionBody);
    });

    dispatch({
      type: actionTypes.TRANSACTION_TYPE_LOADED,
      payload: transactionTypeOptions,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.TRANSACTION_TYPE_ERROR,
    });
    console.log(err);
  }
};

// ****************
// Action to retrieve transaction categories for specific type
// ****************
export const getTransactionCategories = (type) => async (dispatch) => {
  try {
    setAuthToken(localStorage.accessToken);
    const res = await axios.get(`/api/category/${type}`);
    let categoryOptions = [];

    res.data.forEach((category) => {
      let optionBody = {};
      optionBody.key = 'category_' + category.name;
      optionBody.text = category.name;
      optionBody.value = category.name;
      categoryOptions.push(optionBody);
    });

    dispatch({
      type: actionTypes.TRANSACTION_CATEGORY_LOADED,
      payload: categoryOptions,
    });
    console.log(res.data);
  } catch (err) {
    console.log(err);
    if (err.response.status === 401) {
      dispatch(refreshToken(localStorage.refreshToken));
    }
    dispatch({
      type: actionTypes.TRANSACTION_CATEGORY_ERROR,
    });
  }
};

// ****************
// Action to submit a new Transaction
// ****************
export const submitTransaction = (formData) => async (dispatch) => {
  try {
    setAuthToken(localStorage.accessToken);
    const keys = Object.keys(formData);
    keys.forEach((key) => {
      if (formData[key] === '' || formData[key] === null) {
        delete formData[key];
      }
    });

    let file = new FormData();
    if (formData['file'] !== null) {
      file.append('file', formData.file, formData.file.name);
      delete formData['file'];
    }

    dispatch({
      type: actionTypes.TRANSACTION_SUBMIT_LOADING,
    });

    const resData = await axios.post('api/transaction/', formData);
    console.log(resData);

    if (formData['file'] !== null) {
      const resFile = await axios.post(
        `/api/transaction/file/${resData.data._id}`,
        file
      );
      console.log(resFile);
    }

    dispatch({
      type: actionTypes.TRANSACTION_SUBMIT_SUCCESS,
    });
    dispatch({
      type: actionTypes.CLOSE_MODAL,
    });
    // console.log(resData);
    // console.log(resFile);
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(refreshToken(localStorage.refreshToken));
    }
    console.log(error.response);

    let errors = null;
    if (error.response.data.hasOwnProperty('errors')) {
      errors = error.response.data.errors;
    } else {
      //do something for file upload error
    }

    let errorObject = [];
    errors.forEach((e) => {
      errorObject.push(e.msg);
    });

    dispatch({
      type: actionTypes.TRANSACTION_SUBMIT_ERROR,
      payload: errorObject,
    });
  }
};

export const editTransaction = () => async (dispatch) => {
  console.log('EDIT');
};

// ****************
// Action to open transaction modal
// ****************
export const openModal = (mode, prevTransaction = {}) => async (dispatch) => {
  console.log('OPEN');
  console.log(mode);
  switch (mode) {
    case 'add':
      dispatch({
        type: actionTypes.OPEN_ADD_MODAL,
      });
      break;
    case 'edit':
      dispatch({
        type: actionTypes.OPEN_EDIT_MODAL,
        payload: prevTransaction,
      });
      break;
    case 'delete':
      dispatch({
        type: actionTypes.OPEN_DELETE_MODAL,
        payload: prevTransaction,
      });
      break;
    default:
      return;
  }
};

// ****************
// Action to close transaction modal
// ****************
export const closeModal = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CLOSE_MODAL,
  });
};

export const openEditModal = (currTransaction) => async (dispatch) => {
  let transactionObject = {};
  transactionObject.amount = currTransaction.amount;
  transactionObject.name = currTransaction.name;
  transactionObject.type = currTransaction.type.name;
  transactionObject.category = currTransaction.category.name;
  transactionObject.date = currTransaction.date;
  console.log(currTransaction);
  dispatch(getTransactionCategories(transactionObject.type));

  dispatch({
    type: actionTypes.OPEN_EDIT_MODAL,
    payload: transactionObject,
  });
};

export const getFile = (currTransaction) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'x-auth-token': localStorage.token,
      },
    };
    const file = await axios.get(
      `/api/transaction/file/${currTransaction._id}`,
      config
    );

    console.log(file);
  } catch (error) {
    console.log(error);
  }
};
