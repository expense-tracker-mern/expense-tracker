import React, { useEffect, Fragment, useState } from 'react';
import { Container, Grid, Segment, List, Image, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import dateFormat from 'dateformat';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Doughnut, Bar } from "react-chartjs-2";

import "./Dashboard.css";
import "../../../src/App.css";

export const Dashboard = (props) => {

    const { getTransactions } = props;

    var dates = [];
    var present = false;

    const [startDate, setStartDate] = useState({
        month: new Date(),
        year: new Date(),
        date: null,
        type: "month"
    });

    useEffect(() => {
        getTransactions(startDate.date ? startDate.date : dateFormat(startDate.month, "mm-yyyy"), startDate.type);
    }, [getTransactions, startDate]);

    const transaction = props.transactions || {};
    console.log(transaction);

    const changeDate = (d, type) => {
        if (type === 'month') {
            setStartDate(
                {
                    ...startDate,
                    month: d,
                    date: dateFormat(d, "mm-yyyy"),
                    type: "month"
                });
        } else {
            setStartDate(
                {
                    ...startDate,
                    year: d,
                    date: dateFormat(d, "yyyy"),
                    type: "year"
                });
        }
    }

    const options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                }
            }]
        }
    }

    const barData = {
        labels: Object.keys(props.amount),
        datasets: [
            {
                label: 'Transaction',
                backgroundColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: Object.values(props.amount),
            }
        ]
    };

    const backgroundColor = [
        'rgba(174, 247, 96, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(252, 245, 33, 1)',
        'rgba(34, 159, 64, 1)',
        'rgba(34, 56, 12, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(123, 159, 64, 1)',
        'rgba(255, 111, 64, 1)',
        'rgba(255, 100, 45, 1)',
        'rgba(254, 159, 78, 1)',
        'rgba(65, 56, 64, 1)',
        'rgba(211, 159, 87, 1)',
        'rgba(12, 76, 21, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
    ];

    const incomeData = {
        labels: Object.keys(props.incomeCategories),
        datasets: [
            {
                label: 'Categories',
                data: Object.values(props.incomeCategories),
                backgroundColor: backgroundColor,
                borderWidth: 1,
            },
        ],
    }

    const expenseData = {
        labels: Object.keys(props.expenseCategories),
        datasets: [
            {
                label: 'Categories',
                data: Object.values(props.expenseCategories),
                backgroundColor: backgroundColor,
                borderWidth: 1,
            },
        ],
    }

    return (
        <Container className="container">
            <Grid stackable columns={2}>
                <Grid.Column>
                    <Segment>
                        <div className="dateDiv">
                            <DatePicker
                                selected={startDate.month}
                                onChange={(date) => changeDate(date, "month")}
                                dateFormat="MMMM-yyyy"
                                showMonthYearPicker
                            />
                            <DatePicker
                                selected={startDate.year}
                                onChange={(date) => changeDate(date, "year")}
                                showYearPicker
                                dateFormat="yyyy"
                            />
                        </div>
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
                                                                <h5 className={transaction.type.name === 'expense' ? "expenses" : "income"}>
                                                                    {transaction.type.name === 'expense' ? "-" : "+"}   &#8377; {transaction.amount}
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
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <div style={{ textAlign: "center", padding: '10px' }}>
                            <h4>Transactions</h4>
                        </div>
                        <div className="doughnutDiv">
                            <Bar
                                data={barData}
                                width={300}
                                height={300}
                                options={options}
                            />
                        </div>
                    </Segment>
                    <Segment>
                        <div style={{ textAlign: "center", padding: '10px' }}>
                            <h4>Income Categories (%)</h4>
                        </div>
                        <div className="doughnutDiv">
                            <Doughnut width={250} height={250}
                                options={{ maintainAspectRatio: false }} data={incomeData} />
                        </div>
                    </Segment>
                    <Segment>
                        <div style={{ textAlign: "center", padding: '10px' }}>
                            <h4>Expense Categories (%)</h4>
                        </div>
                        <div className="doughnutDiv">
                            <Doughnut width={250} height={250}
                                options={{ maintainAspectRatio: false }} data={expenseData} />
                        </div>
                    </Segment>
                </Grid.Column>
            </Grid>
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
        loading: state.transaction.loading,
        incomeCategories: state.transaction.incomeCategories,
        expenseCategories: state.transaction.expenseCategories,
        amount: state.transaction.amount
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: (date, type) => dispatch(actions.getTransactions(date, type)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
