const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const helmet = require('helmet');
const scribe = require('scribe-js')();
const console = process.console;

const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(scribe.express.logger());
app.use('/logs', scribe.webPanel());

app.use(helmet());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


//ROUTES
app.use('/', require('./api/pve-config'));
app.use('/', require('./api/pve-cluster'));
app.use('/', require('./api/pve-container'));
app.use('/', require('./api/pve-node'));
app.use('/', require('./api/pve-doc'));
app.use('/', require('./api/pve-user'));
app.use('/', require('./api/pve-template'));
app.use('/', require('./api/pve-vnc'));


app.get('/', (req, res, next) => {
    res.send('Running');
});

app.use((err, req, res, next) => {
    console.log('ERR', err);
    res.status(err.status || 500);
    res.send('Error ');
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '!');
});
