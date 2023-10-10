// require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const tradeRoutes = require('./routes/tradeRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const offerRoutes = require('./routes/offerRoutes.js');

// create app
const app = express();

// configure app
let port = 5001;
let host = 'localhost';
app.set('view engine', 'ejs');

//connect to database
mongoose.connect('mongodb://127.0.0.1:27017/tradedb', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> {
    app.listen(port,host,()=> { 
        console.log('Server running on port', port);
    })
})
.catch((err)=> console.log(err.message));

// mount middleware
app.use(
    session({
        secret: "sfsdafsakjlfdsakf",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://127.0.0.1:27017/tradedb'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.myProfile = req.session.user || null;
    res.locals.firstName = req.session.firstName || null;
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));


// set up routes
app.get('/', (req, res)=>{
    res.render('index')
});
app.get('/about', (req, res)=>{
    res.render('about')
});
app.get('/contact', (req, res)=>{
    res.render('contact')
});


app.use('/trades', tradeRoutes);
app.use('/users', userRoutes);
app.use('/offers', offerRoutes);

app.use((req, res, next) => {
    let error = new Error('The sever cannot locate '+ req.url);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if(!err.status) {
        err.status = 500;
        err.message - ("Internal server error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});
 
