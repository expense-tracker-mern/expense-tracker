import * as actionTypes from '../actions/actionTypes';

const initialState = {
    error: null,
    transactions: null,
    loading: true,
    total: 0,
    income: 0,
    expenses: 0,
    amount: [],
    categories: [],
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
                categories: action.categories,
                amount: action.amount
            }
        case actionTypes.GET_TRANSACTIONS_FAIL:
            return {
                ...state,
                error: action.error,
                loading: action.loading
            }
        default:
            return state;
    }
};

export default reducer;