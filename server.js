const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Init middleware
// for parsing application/json
app.use(express.json({ extended: false })); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

app.use(express.static('public'));

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/transaction', require('./routes/api/transaction'));
app.use('/api/transaction-type', require('./routes/api/transactionType'));
app.use('/api/category', require('./routes/api/category'));

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
