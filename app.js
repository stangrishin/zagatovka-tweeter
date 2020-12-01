require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const indexRouter = require('./routes/indexRouter');

const dbConnect = require('./config/db');

const app = express();
dbConnect();

app.set('view engine', 'hbs');
app.set('views', path.join(process.env.PWD, 'views'));
hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.env.PWD, 'public')));

app.use(cookieParser());

// require('crypto').randomBytes(64).toString('hex')
app.use(
  session({
    name: 'sid',
    secret: process.env.SECRETSESSION,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.email = req.session?.user?.email;
  res.locals.id = req.session?.user?.id;
  res.locals.name = req.session?.user?.name;
  next();
});

app.use('/', indexRouter);

app.listen(process.env.PORT, () => {
  console.log('Server has been started on port ', process.env.PORT);
});
