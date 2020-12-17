import {combineReducers} from 'redux';
import transactionreducer from './transaction';

export default combineReducers({
    transaction: transactionreducer,
});