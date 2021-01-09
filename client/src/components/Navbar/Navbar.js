import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import { logout } from '../../store/actions/auth';
import { useHistory } from 'react-router-dom';
import { openModal } from '../../store/actions/transaction';
import TransactionModal from './TransactionModal';

const Navbar = ({ isAuthenticated, logout, openModal, expire }) => {
  
  // const [modalOpen, changeModalOpen] = useState(false);

  const history = useHistory();

  console.log(expire);

  const addTransaction = (e) => {
    e.preventDefault();
  };

  const out = () => {
    logout();
    history.push('/');
  };

  const openModalAdd = () => {
    console.log('ADD');
    openModal('add');
  };
  return (localStorage.accessToken && expire === false) ? (
    <div>
      <Menu fixed="top" className="navbar">
        <Menu.Item as="a" header>
          Expense Tracker
        </Menu.Item>
        <Menu.Item as="a">Home</Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item as="a" onClick={() => openModalAdd()}>
            <Icon size="large" name="add" className="add-icon" />
          </Menu.Item>
          <Dropdown item simple icon="user">
            <Dropdown.Menu>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item onClick={out}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
      <TransactionModal />
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  expire: state.auth.expire
});

export default connect(mapStateToProps, { logout, openModal })(Navbar);
