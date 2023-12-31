const express = require('express');
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const postRoute = require(`./routes/postRoute`);
const userRoute = require(`./routes/userRoute`);
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const notificationRoute = require('./routes/notificationRoute');

const appError = require('./utils/appError');
const errGlobalHandler = require('./controllers/errorController');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1) Middleware
// Security http header
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // Nó sẽ xóa các ký tự như $

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    Whilelist: []
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit request from same API
const limiter = ratelimit({
  max: 100,
  widowMS: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again after 1 hour'
});
app.use('/api', limiter);

// Body parser, reading data from the body request (req.body)
app.use(express.json({ limit: '10kb' })); // chuyển đổi req.body thành dạng đối tượng javascript

// Serving static files
// app.use(express.static(`${__dirname}/public`));

// ROUTE
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/chats', chatRoute);
app.use('/api/v1/messages', messageRoute);
app.use('/api/v1/notifications', notificationRoute);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} in the server`, 404));
});

app.use(errGlobalHandler);

module.exports = app;
