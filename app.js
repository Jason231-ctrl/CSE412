const express = require('express');
const path = require('path');
const cors = require('cors');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const { response } = require('express');
const routes = require('./routes/routes');
const app = express();

process.env.PWD = process.cwd()

//middleware
app.use(cors());
app.use(express.json()); //req.body
app.use(express.static(process.env.PWD + '/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use('/', routes);

// view engine setup
nunjucks.configure('views', {
    autoescape : true,
    express : app
})
app.set('view engine', 'html');

app.listen(5001, () => {
    console.log('server has started on port 5001')
});

module.exports = app;