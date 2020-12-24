import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown } from 'semantic-ui-react';
import TransactionModal from './TransactionModal';
import { useHistory } from 'react-router-dom';
import { logout } from '../../store/actions/auth';

const Navbar = ({ isAuthenticated, logout }) => {
  console.log(isAuthenticated);
  const [modalOpen, changeModalOpen] = useState(false);

  const history = useHistory();

  const addTransaction = (e) => {
    e.preventDefault();
  };

  const out = () => {
    logout();
    history.push('/');
  };

  return localStorage.token ? (
    <div>
      <Menu fixed="top" className="navbar">
        <Menu.Item as="a" header>
          Expense Tracker
        </Menu.Item>
        <Menu.Item as="a">Home</Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item as="a" onClick={() => changeModalOpen(true)}>
            <TransactionModal
              modalOpen={modalOpen}
              changeModalOpen={changeModalOpen}
            />
          </Menu.Item>
          <Dropdown item simple icon="user">
            <Dropdown.Menu>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item onClick={out}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Navbar);
