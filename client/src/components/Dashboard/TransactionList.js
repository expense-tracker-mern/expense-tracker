import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { List, Image, Divider, Icon } from 'semantic-ui-react';
import dateFormat from 'dateformat';
import TransactionModal from '../Navbar/TransactionModal';
import { openEditModal } from '../../store/actions/transaction';

export const TransactionList = (props) => {
  var dates = [];
  var present = false;

  const openEdit = (currTransaction) => {
    props.openEditModal(currTransaction);
  };
  return (
    <List relaxed>
      {props.transactions.map((transaction) => {
        if (dates.includes(dateFormat(transaction.date, 'mmmm dS, yyyy'))) {
          present = true;
        } else {
          dates.push(dateFormat(transaction.date, 'mmmm dS, yyyy'));
          present = false;
        }
        return (
          <List.Item key={transaction._id}>
            <List.Content>
              {!present && (
                <Fragment>
                  <Divider section />
                  <List.Item>
                    <List.Content>
                      <h4>
                        {dateFormat(transaction.date, 'dddd, mmmm dS, yyyy')}
                      </h4>
                    </List.Content>
                  </List.Item>
                </Fragment>
              )}
              <List relaxed>
                <List.Item>
                  <List.Content floated="right" verticalAlign="middle">
                    <div style={{ display: 'flex' }}>
                      <h5
                        className={
                          transaction.type.name === 'expense'
                            ? 'expenses'
                            : 'income'
                        }
                        style={{ marginRight: '10px' }}
                      >
                        {transaction.type.name === 'expense' ? '-' : '+'}{' '}
                        &#8377; {transaction.amount}
                      </h5>
                      <Icon
                        className="edit-transaction"
                        name="edit"
                        size="large"
                        onClick={() => openEdit(transaction)}
                      />
                    </div>
                  </List.Content>
                  <Image
                    verticalAlign="middle"
                    avatar
                    src={transaction.category.image}
                  />
                  <List.Content verticalAlign="middle">
                    <List.Header>{transaction.category.name}</List.Header>
                  </List.Content>
                </List.Item>
              </List>
            </List.Content>
          </List.Item>
        );
      })}
      <TransactionModal />
    </List>
  );
};

export default connect(null, { openEditModal })(TransactionList);
