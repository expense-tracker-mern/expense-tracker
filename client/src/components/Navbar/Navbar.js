import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown } from 'semantic-ui-react';
import { logoutUser } from '../../store/actions/auth';
import TransactionModal from './TransactionModal';

const Navbar = ({ isAuthenticated, logoutUser }) => {
  const [modalOpen, changeModalOpen] = useState(false);

  const addTransaction = (e) => {
    e.preventDefault();
  };

  const logout = () => {
    logoutUser();
  };

  return (
    isAuthenticated && (
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
                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
