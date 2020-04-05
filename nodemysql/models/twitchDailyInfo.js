module.exports = (sequelize, DataTypes) => {
    const Twitchdailyinfo = sequelize.define('twitchdailyinfo', { // 테이블명 streamers
        date: {
            type: DataTypes.STRING(8), 
            allowNull: false,
            description : '날짜'
        },
        fllower: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue : 0,
            description : '팔오워숫자'
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue : 0,
            description : '전체 뷰숫자'
        },
        loginId: {
            type: DataTypes.STRING,
            allowNull: false,
            description : '로그인등에 사용되는 아이디'
        },
    },
    {indexes : [{fields:['date','loginId']}]}
    , {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
    
    return Twitchdailyinfo;
  };