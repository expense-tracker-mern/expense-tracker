const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();

//Connect Database
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/transaction', require('./routes/api/transaction'));
app.use('/api/transaction-type', require('./routes/api/transactionType'));
app.use('/api/category', require('./routes/api/category'));

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
