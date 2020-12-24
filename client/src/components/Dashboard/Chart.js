import React from 'react';
import {Grid, Segment} from 'semantic-ui-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';

export const Chart = (props) => {

    const options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

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
            },
        ],
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
    };

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
    };

    return (
        <Grid.Column>
        <Segment>
            <div className="doughnutDiv">
                <Bar data={barData} width={300} height={300} options={options} />
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
    )
}

const mapStateToProps = (state) => {
    return {
        incomeCategories: state.transaction.incomeCategories,
        expenseCategories: state.transaction.expenseCategories,
        amount: state.transaction.amount,
    };
};

export default connect(mapStateToProps)(Chart);
