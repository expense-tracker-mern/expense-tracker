import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

const Navbar = ({ history }) => {
  const [searchText, updateSearchText] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    history.push({ pathname: '/search', search: `?query=${searchText}` });
  };

  return (
    <div>
      <Menu fixed="top">
        <Container></Container>
      </Menu>
    </div>
  );
};

export default withRouter(Navbar);
