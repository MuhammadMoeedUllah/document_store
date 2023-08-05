const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// session setup
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const {validateJwt} = require('./middlewares')


// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const ordersRouter = require('./routes/orders');

const {JWT_SESSION_TIMEOUT} = require('./components')
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware setup
app.use(
  expressSession({
    cookie: {
     maxAge: JWT_SESSION_TIMEOUT,
     path: "/api"
    },
    secret: process.env.JWT_SECRETKEY,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);


// routes
app.use('/api/user', usersRouter);
app.use('/api/books',validateJwt, booksRouter);
app.use('/api/orders',validateJwt, ordersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  return res.status(400).json({message: "Not Found"});
});

module.exports = app;
