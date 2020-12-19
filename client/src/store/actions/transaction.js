import * as actionTypes from './actionTypes';
import axios from 'axios';
import dateFormat from 'dateformat';

export const getTransactions = (date, type) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkOGZkY2FiMzU1ODgzZWE4ZGQzZDAwIn0sImlhdCI6MTYwODE5MTQxMSwiZXhwIjoxNjA4NTUxNDExfQ.uH8csE9JIoi9AN1XZsaSVLI1kZSfJjiipXdMAdirjFM'
            }
        }
        const transactions = await axios.get('api/transaction/all-transactions/' + type + '/' + date, config);

        //Categories for pie chart
        let categories = Object.values(transactions.data)
            .map(transaction => { return transaction.category.name });
        var categoriesCount = {};
        categories.forEach((i) => { categoriesCount[i] = (categoriesCount[i] || 0) + 1; });

        //Transaction amounts for bar chart
        let dates = Object.values(transactions.data)
            .map(transaction => ({
                date: type === "month" ? dateFormat(transaction.date, "d") : dateFormat(transaction.date, "mmmm"),
                amount: transaction.amount,
                type: transaction.type.name
            }));

        var list = [];
        var years = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        if (type === 'year') {
            years.forEach((i) => {
                if(!dates.some(item => item.date === i.toString())){
                    dates.push({date: i, amount: 0, expense: "Income"})
                }
            });
            dates.sort((a,b) => {return years.indexOf(a.date) - years.indexOf(b.date);});
        } else {
            for (var i = 1; i < 32; i++) {
                list.push(i);
            }
            list.forEach((i) => {
                if(!dates.some(item => item.date === i.toString())){
                    dates.push({date: i, amount: 0, expense: "Income"})
                }
            })
        }
        var amount = {};

        dates.forEach((i) => {
            i.type === "Income" ?
                amount[i.date] = (amount[i.date] || 0) + i.amount :
                amount[i.date] = (amount[i.date] || 0) - i.amount
                ;
        });

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
            categories: categoriesCount,
            amount: amount
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: actionTypes.GET_TRANSACTIONS_FAIL,
            error: error
        });
    }
};