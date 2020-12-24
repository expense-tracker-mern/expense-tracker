import React,{Fragment} from 'react';
import {
    List,
    Image,
    Divider,
} from 'semantic-ui-react';
import dateFormat from 'dateformat';

export const TransactionList = (props) => {
    var dates = [];
    var present = false;
    return (
        <List relaxed>
            {props.transactions.map((transaction) => {
                if (
                    dates.includes(
                        dateFormat(transaction.date, 'mmmm dS, yyyy')
                    )
                ) {
                    present = true;
                } else {
                    dates.push(
                        dateFormat(transaction.date, 'mmmm dS, yyyy')
                    );
                    present = false;
                }
                return (
                    <List.Item key={transaction._id}>
                        <List.Content>
                            {!present && (
                                <Fragment>
                                    <Divider section />
                                    <List.Item>
                                        <List.Content>
                                            <h4>
                                                {dateFormat(
                                                    transaction.date,
                                                    'dddd, mmmm dS, yyyy'
                                                )}
                                            </h4>
                                        </List.Content>
                                    </List.Item>
                                </Fragment>
                            )}
                            <List relaxed>
                                <List.Item>
                                    <List.Content floated="right">
                                        <h5
                                            className={
                                                transaction.type.name ===
                                                    'expense'
                                                    ? 'expenses'
                                                    : 'income'
                                            }
                                        >
                                            {transaction.type.name === 'expense'
                                                ? '-'
                                                : '+'}{' '}
                                            &#8377; {transaction.amount}
                                        </h5>
                                    </List.Content>
                                    <Image
                                        verticalAlign="middle"
                                        avatar
                                        src={transaction.category.image}
                                    />
                                    <List.Content verticalAlign="middle">
                                        <List.Header>
                                            {transaction.category.name}
                                        </List.Header>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </List.Content>
                    </List.Item>
                );
            })}
        </List>
    )
}

export default TransactionList;
