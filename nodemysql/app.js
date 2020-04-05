const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const moment = require('moment');

const twitchRouter = require('./routes/twitch');
require('./sechedule');
const prod = process.env.NODE_ENV === 'production';
const db = require('./models');

const app = express();

dotenv.config();
db.sequelize.sync({force: false});

if (prod) {
    app.use(morgan('combined'));
    // front 빌드가 잘적용되면 cros 삭제한다.
    app.use(cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }));
  } else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: 'http://localhost:8080',
        credentials: true,
    }));
  }

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/twitch', twitchRouter);
moment.locale();
app.get('/', (req, res) => {
  res.status(200).json(moment().format('lll'));
});



//const api = require('./api/twitch')
//api.streamInfoCall(10);
//api.viewSchedule();
//api.followsSchedule();


app.listen(prod ? process.env.PORT : 80, () => {
  console.log(`백엔드 서버 ${prod ? process.env.PORT : 80}번 포트에서 작동중.`);
});