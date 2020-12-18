import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getTransactions = (date, type) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkOGZkY2FiMzU1ODgzZWE4ZGQzZDAwIn0sImlhdCI6MTYwODE5MTQxMSwiZXhwIjoxNjA4NTUxNDExfQ.uH8csE9JIoi9AN1XZsaSVLI1kZSfJjiipXdMAdirjFM'
            }
        }
        const transactions = await axios.get('api/transaction/all-transactions/' + type + '/' + date, config);

        let categories = Object.values(transactions.data)
            .map(transaction => { return transaction.category.name });
            var categoriesCount = {};
            categories.forEach((i) => { categoriesCount[i] = (categoriesCount[i]||0) + 1;});

        var total = 0, income = 0, expenses = 0;
        transactions.data.map(t => {
            if (t.type.name === 'Expense') {
                return [total = total - t.amount, expenses = expenses + t.amount]
            } else {
                return [total = total + t.amount, income = income + t.amount]
            }
        });
        dispatch({
            type: actionTypes.GET_TRANSACTIONS,
            transactions: transactions.data,
            total: total,
            income: income,
            expenses: expenses,
            categories: categoriesCount
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: actionTypes.GET_TRANSACTIONS_FAIL,
            error: error
        });
    }
};