import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Grid, Divider, Message } from 'semantic-ui-react';
import {
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
  editTransaction,
  closeModal,
} from '../../store/actions/transaction';
import { connect } from 'react-redux';
import DateFnsUtils from '@date-io/date-fns';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

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
    date: '',
    file: null,
  });
  const [title, updateTitle] = useState('Add Transaction');
  const fileInputRef = useRef(null);

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
    const { name, value, files } = result || event.target;

    if (name === 'type') {
      getTransactionCategories(value);
    }
    if (name === 'file') {
      console.log(files[0]);
      console.log(form);
      setForm({ ...form, [name]: event.target.files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    console.log('MODAL');
    switch (mode) {
      case 'add':
        updateTitle('Add Transaction');
        setForm({});
        break;
      case 'edit':
        updateTitle('Edit Transaction');
        setForm(prevTransaction);
        break;
      case 'delete':
        updateTitle('Delete Transaction');
        setForm(prevTransaction);
        break;
      default:
        return;
    }
    // if (mode === 'add') {
    //   updateTitle('Add Transaction');
    //   setForm({});
    // } else {
    //   updateTitle('Edit Transaction');
    //   setForm(prevTransaction);
    // }
    getTransactionTypes();
  }, [modalOpen]);

  // const fileChange = () => {
  //   console.log('test');
  // };

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
              <Grid.Row>
                <Grid.Column>
                  <SemanticDatepicker
                    locale="en-US"
                    name="date"
                    onChange={onFormValueChange}
                    type="basic"
                    format="DD-MM-YYYY"
                    label="Transaction Date"
                    className="formDate"
                  />
                </Grid.Column>
                <Grid.Column>
                  <Form.Button
                    fluid
                    name="file"
                    label="Transaction Receipt"
                    type="button"
                    content="Upload File"
                    labelPosition="left"
                    icon="file"
                    onClick={() => fileInputRef.current.click()}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="file"
                    hidden
                    onChange={onFormValueChange}
                  />
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
