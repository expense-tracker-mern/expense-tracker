const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();

//Connect Database
connectDB();

//Init middleware
app.use(express.json({extended: false}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/',(req,res) => res.send('API Running'));

const PORT = process.env.PORT || 1000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));