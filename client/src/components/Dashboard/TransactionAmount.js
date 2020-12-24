import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';

export const TransactionAmount = (props) => {
    return (
        <Grid stackable columns={3} textAlign="center">
            <Grid.Row>
                <Grid.Column>
                    <Segment>
                        <div>Income</div>
                        <div>
                            <h5 className="income">
                                &#8377; {props.income}
                            </h5>
                        </div>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <div>Expenses</div>
                        <div>
                            <h5 className="expenses">
                                &#8377; {props.expenses}
                            </h5>
                        </div>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment>
                        <div>Total</div>
                        <div>
                            <h5>
                                {Math.sign(props.total) === -1
                                    ? '- '
                                    : null}
                                    &#8377;{Math.abs(props.total)}
                            </h5>
                        </div>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

const mapStateToProps = (state) => {
    return {
        total: state.transaction.total,
        income: state.transaction.income,
        expenses: state.transaction.expenses,
    };
};

export default connect(mapStateToProps)(TransactionAmount);
