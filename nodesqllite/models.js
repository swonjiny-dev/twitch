const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db-dev.sqlite',
  // https://github.com/sequelize/sequelize/issues/8417
  operatorsAliases: Sequelize.Op,
  logging: console.log
});

const Streamer = sequelize.define('streamer',{
    loginId : {
        type : Sequelize.STRING,
        description : '로그인등에 사용되는 아이디'
    },
    userId : {
        type : Sequelize.STRING,
        description : '트위치 내부에서 사용되는 아이디 api 호출시 알아야 하는 정보'
    },
    userName : {
        type : Sequelize.STRING,
        description : '트위치 닉네임'
    }
});

module.exports = { 
  sequelize, 
  Op,
  Streamer
}