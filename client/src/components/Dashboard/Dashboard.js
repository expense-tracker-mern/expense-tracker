import React, { useEffect, Fragment } from 'react';
import { Container, Grid, Segment, List, Image, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import dateFormat from 'dateformat';

import "./Dashboard.css";
import "../../../src/App.css";

export const Dashboard = (props) => {

    const { getTransactions } = props;

    var dates = [];
    var present = false;

    useEffect(() => {
        getTransactions();
    }, [getTransactions]);

    const transaction = props.transactions || {};
    console.log(transaction);

    return (
        <Container className="container">
            <div className="transactionDiv">
                <Grid columns='equal' textAlign='center'>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <div>Income</div>
                                <div><h5 className="income">&#8377; {props.income}</h5></div>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <div>Expenses</div>
                                <div><h5 className="expenses">&#8377; {props.expenses}</h5></div>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <div>Total</div>
                                <div><h5>{Math.sign(props.total) === -1 ? '- ' : null}&#8377;{Math.abs(props.total)}</h5></div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {transaction.length > 0 ?
                    <List relaxed>
                        {transaction.map(transaction => {
                            if (dates.includes(dateFormat(transaction.date, "mmmm dS, yyyy"))) {
                                present = true;
                            } else {
                                dates.push(dateFormat(transaction.date, "mmmm dS, yyyy"));
                                present = false;
                            }
                            return (
                                <List.Item key={transaction._id}>
                                    <List.Content>
                                        {!present && 
                                        <Fragment>
                                        <Divider section />
                                        <List.Item>
                                        <List.Content ><h4>{dateFormat(transaction.date, "dddd, mmmm dS, yyyy")}</h4></List.Content>
                                        </List.Item>
                                        </Fragment>
                                        }
                                        <List relaxed>
                                            <List.Item>
                                                <List.Content floated='right'>
                                                    <h5 className={transaction.type.name === 'Expense' ? "expenses" : "income"}>
                                                        {transaction.type.name === 'Expense' ? "-" : "+"}   &#8377; {transaction.amount}
                                                    </h5>
                                                </List.Content>
                                                <Image verticalAlign="middle" avatar src={transaction.category.image} />
                                                <List.Content verticalAlign="middle">
                                                    <List.Header>{transaction.category.name}</List.Header>
                                                </List.Content>
                                            </List.Item>
                                        </List>
                                    </List.Content>
                                </List.Item>
                            )
                        })}
                    </List> :
                    <div>No Transactions found</div>
                }
            </div>
        </Container>
    )
}

const mapStateToProps = state => {
    return {
        error: state.transaction.error,
        transactions: state.transaction.transactions,
        total: state.transaction.total,
        income: state.transaction.income,
        expenses: state.transaction.expenses,
        loading: state.transaction.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: () => dispatch(actions.getTransactions()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
