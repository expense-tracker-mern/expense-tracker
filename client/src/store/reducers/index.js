import { combineReducers } from 'redux';
import transactionreducer from './transaction';
import auth from './auth';

export default combineReducers({
  transaction: transactionreducer,
  auth: auth,
});
