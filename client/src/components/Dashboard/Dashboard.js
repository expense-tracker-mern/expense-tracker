import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Grid, Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Charts from './Chart';
import Transaction from './Transaction';
import { useHistory } from 'react-router-dom';

import './Dashboard.css';
import '../../../src/App.css';

export const Dashboard = (props) => {
    const history = useHistory();
console.log(props.expire);
    
    if(props.expire){
        history.push('/');
    }

  return localStorage.accessToken ? (
    props.loading ? (
      <Loader active inline="centered" />
    ) : (
      <Container className="container">
        <Grid stackable columns={2}>
          <Grid.Column>
            <Transaction />
          </Grid.Column>
          <Charts />
        </Grid>
      </Container>
    )
  ) : (
    <Redirect to="/" />
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.transaction.transactionListLoading,
    expire: state.auth.expire
  };
};

export default connect(mapStateToProps)(Dashboard);
