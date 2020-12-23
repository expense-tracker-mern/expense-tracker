import * as actionTypes from './actionTypes';
import axios from 'axios';
import dateFormat from 'dateformat';

export const getTransactions = (date, type) => async (dispatch) => {
  try {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        }
    }
    const transactions = await axios.get('api/transaction/all-transactions/' + type + '/' + date, config);
    console.log(transactions);
    // const transactions = await axios.get(
    //   'api/transaction/all-transactions/' + type + '/' + date
    // );

    //Categories for pie chart
    let categories = Object.values(transactions.data).map((transaction) => {
      return transaction.category.name;
    });
    var categoriesCount = {};
    categories.forEach((i) => {
      categoriesCount[i] = (categoriesCount[i] || 0) + 1;
    });

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
          dates.push({ date: i, amount: 0, expense: 'income' });
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
          dates.push({ date: i, amount: 0, expense: 'income' });
        }
      });
    }
    var amount = {};

    dates.forEach((i) => {
      i.type === 'income'
        ? (amount[i.date] = (amount[i.date] || 0) + i.amount)
        : (amount[i.date] = (amount[i.date] || 0) - i.amount);
    });

    var total = 0,
      income = 0,
      expenses = 0;
    transactions.data.map((t) => {
      if (t.type.name === 'expense') {
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
      categories: categoriesCount,
      amount: amount,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.GET_TRANSACTIONS_FAIL,
      error: error,
    });
  }
};

export const getTransactionTypes = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/transaction-type/all');
    let transactionTypeOptions = [];
    console.log(res.data);

    res.data.forEach((option) => {
      let optionBody = {};
      optionBody.key = 'type_' + option.name;
      optionBody.text = option.name;
      optionBody.value = option.name.toLowerCase();
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

export const getTransactionCategories = (type) => async (dispatch) => {
  try {
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
    dispatch({
      type: actionTypes.TRANSACTION_CATEGORY_ERROR,
    });
  }
};

export const submitTransaction = (formData) => async (dispatch) => {
  try {
    console.log(formData);
    const res = await axios.post('api/transaction/', formData);
    console.log(res);
  } catch (error) {
    console.log(error);
    dispatch({
      type: actionTypes.TRANSACTION_SUBMIT_ERROR,
      payload: error,
    });
  }
};
