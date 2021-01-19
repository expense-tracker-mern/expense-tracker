import React from 'react';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { closeInvoice } from '../../store/actions/transaction';
import dateFormat from 'dateformat';

const InvoiceModal = ({
  showInvoice,
  invoiceFile,
  closeInvoice,
  fileType,
  transaction,
}) => {
  const closeModal = () => {
    closeInvoice();
  };
  return (
    <Modal
      open={showInvoice}
      onClose={() => {
        closeModal();
      }}
      className="invoice-modal"
    >
      <Modal.Header>
        Invoice for {transaction.name} - {dateFormat(transaction.date, 'mmmm dS, yyyy')}
      </Modal.Header>
      <Modal.Content>
        {fileType === 'image' && (
          <img className="invoice-file" alt="invoice" src={invoiceFile} />
        )}
        {fileType === 'pdf' && (
          <embed style={{ width: '100%', height: '45vw' }} src={invoiceFile} />
        )}
      </Modal.Content>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  showInvoice: state.transaction.invoiceModalOpen,
  invoiceFile: state.transaction.invoiceFile,
  fileType: state.transaction.fileType,
  transaction: state.transaction.transaction,
});

export default connect(mapStateToProps, { closeInvoice })(InvoiceModal);
