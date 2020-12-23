import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Dropdown, Icon, Modal } from 'semantic-ui-react';
import TransactionModal from './TransactionModal';

const Navbar = () => {
  const [modalOpen, changeModalOpen] = useState(false);

  const addTransaction = (e) => {
    e.preventDefault();
  };

  return (
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
              <Dropdown.Item>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export default Navbar;
