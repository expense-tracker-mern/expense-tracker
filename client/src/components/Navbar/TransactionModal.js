import React, { useState, useEffect } from 'react';
import { Modal, Form, Grid, Divider, Message } from 'semantic-ui-react';
import {
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
  editTransaction,
  closeModal,
} from '../../store/actions/transaction';
import { connect } from 'react-redux';

const TransactionModal = ({
  modalOpen,
  mode,
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
  categories,
  types,
  errors,
  loading,
  prevTransaction,
  closeModal,
}) => {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    type: '',
    category: '',
  });
  const [title, updateTitle] = useState('Add Transaction');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(mode);
    if (mode === 'add') {
      console.log(form);
      submitTransaction(form);
    } else {
      editTransaction(prevTransaction, form);
    }
  };

  const onFormValueChange = (event, result) => {
    const { name, value } = result || event.target;
    setForm({ ...form, [name]: value });

    if (name === 'type') {
      getTransactionCategories(value);
    }
    // if (name === 'amount' && value === '') {
    //   let formData = form;
    //   delete formData[name];
    //   setForm({ ...formData });
    // }
  };

  useEffect(() => {
    if (mode === 'add') {
      updateTitle('Add Transaction');
      setForm({});
    } else {
      updateTitle('Edit Transaction');
      setForm(prevTransaction);
    }
    getTransactionTypes();
  }, [modalOpen]);

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={() => {
          closeModal();
        }}
        as={Form}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          {errors !== null && (
            <Message
              visible={errors !== null}
              negative
              header="There was some errors with your submission"
              list={errors}
            />
          )}
          <Form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            loading={loading}
          >
            <Grid doubling stackable columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Form.Input
                    name="name"
                    value={form['name']}
                    label="Name"
                    placeholder="Name"
                    onChange={onFormValueChange}
                  ></Form.Input>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input
                    name="amount"
                    value={form.amount}
                    label="Transaction Amount"
                    placeholder="Amount"
                    onChange={onFormValueChange}
                  ></Form.Input>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Form.Select
                    name="type"
                    value={form.type}
                    label="Transaction Type"
                    placeholder="Income"
                    options={types}
                    onChange={onFormValueChange}
                  ></Form.Select>
                </Grid.Column>
                <Grid.Column>
                  <Form.Select
                    name="category"
                    value={form.category}
                    label="Transaction Category"
                    placeholder="Category"
                    options={categories}
                    onChange={onFormValueChange}
                  ></Form.Select>
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row textAlign="center">
                <Grid.Column width={16}>
                  <Form.Button
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    {title}
                  </Form.Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({
  types: state.transaction.types,
  categories: state.transaction.categories,
  errors: state.transaction.transactionSubmitError,
  loading: state.transaction.transactionModalLoading,
  modalOpen: state.transaction.modalOpen,
  mode: state.transaction.mode,
  prevTransaction: state.transaction.prevTransaction,
});

export default connect(mapStateToProps, {
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
  editTransaction,
  closeModal,
})(TransactionModal);
