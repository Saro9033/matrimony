const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error')

//const defaultAvatar = require('./routes/avatar')
const auth = require('./routes/auth')
const message = require('./routes/message')
const chat = require('./routes/chat')

const app = express();
app.use(express.json());

let BASE_URL = `http://localhost:3000`;
if (process.env.NODE_ENV === "production") {
    BASE_URL = process.env.FRONTEND_URL;
}

const corsOptions = {
    origin: BASE_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// For storing avatar images into uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', auth);
app.use('/api/', message);
app.use('/api/', chat);

app.use(errorMiddleware)

module.exports = app;
