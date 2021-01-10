import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { List, Image, Divider, Icon } from 'semantic-ui-react';
import dateFormat from 'dateformat';
import TransactionModal from '../Navbar/TransactionModal';
import { openModal, getFile } from '../../store/actions/transaction';

export const TransactionList = (props) => {
  var dates = [];
  var present = false;

  const openEdit = (currTransaction) => {
    // props.openEditModal(currTransaction);
    props.openModal('edit', currTransaction);
  };

  const openDeleteModal = (transaction) => {
    // props.openModal('delete');
    props.getFile(transaction);
  };

  return (
    <Fragment>
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
                            transaction.type.name === 'Expense'
                              ? 'expenses'
                              : 'income'
                          }
                          style={{ marginRight: '10px' }}
                        >
                          {transaction.type.name === 'Expense' ? '-' : '+'}{' '}
                          &#8377; {transaction.amount}
                        </h5>
                        <Icon
                          className="edit-transaction"
                          name="edit"
                          size="large"
                          onClick={() => openEdit(transaction)}
                        />
                        <Icon
                          name="trash"
                          size="large"
                          onClick={() => openDeleteModal(transaction)}
                        />
                        {transaction['file'] && (
                          <Icon name="file" size="large" />
                        )}
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
      </List>
      <TransactionModal />
    </Fragment>
  );
};

export default connect(null, { openModal, getFile })(TransactionList);
