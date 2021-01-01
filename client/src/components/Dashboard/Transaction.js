import React, { useEffect, useState } from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import dateFormat from 'dateformat';
import 'react-datepicker/dist/react-datepicker.css';

import TransactionAmount from './TransactionAmount';
import TransactionList from './TransactionList';

export const Transaction = (props) => {
  const { getTransactions } = props;

  const [startDate, setStartDate] = useState({
    month: new Date(),
    year: new Date(),
    date: null,
    type: 'month',
  });

  useEffect(() => {
    getTransactions(
      startDate.date ? startDate.date : dateFormat(startDate.month, 'mm-yyyy'),
      startDate.type
    );
  }, [getTransactions, startDate, props.submitSuccess]);

  const transaction = props.transactions || {};
  console.log(transaction);

  const changeDate = (d, type) => {
    if (type === 'month') {
      setStartDate({
        ...startDate,
        month: d,
        date: dateFormat(d, 'mm-yyyy'),
        type: 'month',
      });
    } else {
      setStartDate({
        ...startDate,
        year: d,
        date: dateFormat(d, 'yyyy'),
        type: 'year',
      });
    }
  };
  return (
    <Segment>
      <div className="dateDiv">
        <Grid stackable columns={2} textAlign="center">
          <Grid.Row>
            <Grid.Column>
              <Segment className="datePickerDiv">
                <DatePicker
                  selected={startDate.month}
                  onChange={(date) => changeDate(date, 'month')}
                  dateFormat="MMMM-yyyy"
                  showMonthYearPicker
                />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment className="datePickerDiv">
                <DatePicker
                  selected={startDate.year}
                  onChange={(date) => changeDate(date, 'year')}
                  showYearPicker
                  dateFormat="yyyy"
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <div className="transactionDiv">
        <TransactionAmount />
        {transaction.length > 0 ? (
          <TransactionList transactions={transaction} />
        ) : (
          <div>No Transactions found</div>
        )}
      </div>
    </Segment>
  );
};

const mapStateToProps = (state) => {
  return {
    error: state.transaction.transactionLoadError,
    transactions: state.transaction.transactions,
    submitSuccess: state.transaction.submitSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTransactions: (date, type) =>
      dispatch(actions.getTransactions(date, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
