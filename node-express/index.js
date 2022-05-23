const express = require('express'),
     http = require('http');
const morgan = require('morgan');
const hostname = 'localhost';
const port = 3000;
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/dishes', dishRouter);
app.use('/dishes/:dishId', dishRouter); //not required

app.use('/promotions', promoRouter);
app.use('/promotions/:promoId', promoRouter);

app.use('/leaders', leaderRouter);
app.use('/leaders/:leaderId', leaderRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});