import React, { useState, useEffect } from 'react';
import { Modal, Icon, Form, Grid, Divider, Message } from 'semantic-ui-react';
import {
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
} from '../../store/actions/transaction';
import { connect } from 'react-redux';

const TransactionModal = ({
  modalOpen,
  changeModalOpen,
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
  categories,
  types,
  errors,
  loading,
}) => {
  const [form, setForm] = useState({});
  const [type, onTypeChange] = useState('');
  const [formSubmit, onFormsubmit] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTransaction(form);
    console.log('TransactionSubmit');
    if (errors === null) {
      onFormsubmit(true);
    }
  };

  const onFormValueChange = (event, result) => {
    const { name, value } = result || event.target;
    setForm({ ...form, [name]: value });

    if (name === 'type') {
      onTypeChange(value);
    }
    if (name === 'amount' && value === '') {
      let formData = form;
      delete formData[name];
      setForm({ ...formData });
    }
  };

  useEffect(() => {
    setForm({});
    changeModalOpen(false);
  }, [formSubmit]);

  useEffect(() => {
    getTransactionTypes();
  }, [modalOpen]);

  useEffect(() => {
    getTransactionCategories(type);
  }, [type]);

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={() => {
          changeModalOpen(false);
        }}
        trigger={<Icon size="large" name="add" className="add-icon" />}
        as={Form}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Modal.Header>Add a Transaction</Modal.Header>
        <Modal.Content>
          {errors !== null && (
            <Message
              visible={errors !== null}
              negative
              header="There was some errors with your submission"
              list={errors}
            />
          )}
          {/* <Message
            visible={errors.length > 0}
            negative
            header="ERROR"
            list={errors}
          /> */}
          {console.log(errors)}
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
                    label="Name"
                    placeholder="Name"
                    onChange={onFormValueChange}
                  ></Form.Input>
                </Grid.Column>
                <Grid.Column>
                  <Form.Input
                    name="amount"
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
                    label="Transaction Type"
                    placeholder="Income"
                    options={types}
                    onChange={onFormValueChange}
                  ></Form.Select>
                </Grid.Column>
                <Grid.Column>
                  <Form.Select
                    name="category"
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
                    Submit
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
  loading: state.transaction.loading,
});

export default connect(mapStateToProps, {
  getTransactionTypes,
  getTransactionCategories,
  submitTransaction,
})(TransactionModal);
