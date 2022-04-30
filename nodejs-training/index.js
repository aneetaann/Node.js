const express = require('express');

// set up express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });

//initialize routes
app.use('/api',require('./routers/info'));

//error handling middleware
app.use(function(err, req, res, next){
    //console.log(err);
    res.status(422).send({error: err.message});
})

//listen for requests on port 3000
app.listen(process.env.port || 5200, function(){
    console.log('listening to port 5200');
});