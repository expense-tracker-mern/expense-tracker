import React from 'react';
import { Redirect } from 'react-router-dom';
import {
    Container,
    Grid
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import Charts from './Chart';
import Transaction from './Transaction';

import './Dashboard.css';
import '../../../src/App.css';

export const Dashboard = (props) => {


    console.log(props.isAuthenticated);

    if (!props.isAuthenticated) {
        return <Redirect to="/" />;
    }

    return (
        <Container className="container">
            <Grid stackable columns={2}>
                <Grid.Column>
                    <Transaction />
                </Grid.Column>
                <Charts />
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    };
};

export default connect(mapStateToProps)(Dashboard);
