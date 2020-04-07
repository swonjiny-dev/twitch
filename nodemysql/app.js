const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const indexRouter = require('./routes/index');
const twitchRouter = require('./routes/twitch');
require('./sechedule');
const prod = process.env.NODE_ENV === 'production';
const db = require('./models');

const app = express();

dotenv.config();
db.sequelize.sync({force: false});
// 개발시에 만 사용하고 배포시 꼭 주석처리 나 삭제
// if (prod) {
//     app.use(morgan('combined'));
//     // front 빌드가 잘적용되면 cros 삭제한다.
//     app.use(cors({
//         origin: 'http://localhost:8080',
//         credentials: true,
//     }));
//   } else {
//     app.use(morgan('dev'));
//     app.use(cors({
//         origin: 'http://localhost:8080',
//         credentials: true,
//     }));
//   }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'/dist')));
app.use('/twitch', twitchRouter);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist' ,'index.html'))
  //res.status(200).json(moment().format('lll'));
});

app.listen(prod ? process.env.PORT : 80, () => {
  console.log(`백엔드 서버 ${prod ? process.env.PORT : 80}번 포트에서 작동중.`);
});