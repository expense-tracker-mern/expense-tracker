import React, { Fragment, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { List, Image, Divider, Icon, Dropdown } from 'semantic-ui-react';
import dateFormat from 'dateformat';
import TransactionModal from '../Navbar/TransactionModal';
import {
  openModal,
  getFile,
  uploadTransactionFile,
} from '../../store/actions/transaction';
import InvoiceModal from '../Navbar/InvoiceModal';

export const TransactionList = (props) => {
  var dates = [];
  var present = false;

  const [transFile, updateFile] = useState(null);
  const [transId, setTransaction] = useState(null);

  const openEdit = (currTransaction) => {
    // props.openEditModal(currTransaction);
    props.openModal('edit', currTransaction);
  };

  const openDeleteModal = (transaction) => {
    // props.openModal('delete');
    props.getFile(transaction);
  };

  const uploadFile = (event, result) => {
    const file = result || event.target;
    updateFile(file[0]);

    props.uploadTransactionFile(transId, transFile);
  };

  const showInvoice = (transaction) => {
    props.getFile(transaction);
  };

  const fileInputRef = useRef(null);

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
                        <Dropdown icon="chevron circle down">
                          <Dropdown.Menu>
                            <Dropdown.Item
                              icon="edit"
                              text="Edit"
                              onClick={() => openEdit(transaction)}
                            />
                            <Dropdown.Item
                              icon="trash"
                              text="Delete"
                              onClick={() => openDeleteModal(transaction)}
                            />
                            <Dropdown.Divider />
                            {!transaction['file'] && (
                              <Dropdown.Item
                                icon="upload"
                                text="Add Receipt"
                                onClick={() => {
                                  fileInputRef.current.click();
                                  setTransaction(transaction.id);
                                }}
                              />
                            )}
                            <input
                              ref={fileInputRef}
                              type="file"
                              name="file"
                              hidden
                              onChange={uploadFile}
                            />
                            {transaction['file'] && (
                              <Dropdown.Item
                                icon="file alternate"
                                text="View Receipt"
                                onClick={() => showInvoice(transaction)}
                              />
                            )}
                            {transaction['file'] && (
                              <Dropdown.Item icon="x" text="Delete Receipt" />
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
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
      {props.transactionModalOpen && <TransactionModal />}
      {props.invoiceModalOpen && <InvoiceModal />}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  invoiceModalOpen: state.transaction.invoiceModalOpen,
  transactionModalOpen: state.transaction.modalOpen,
});

export default connect(mapStateToProps, {
  openModal,
  getFile,
  uploadTransactionFile,
})(TransactionList);
