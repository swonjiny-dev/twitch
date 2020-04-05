module.exports = (sequelize, DataTypes) => {
    const Streamer = sequelize.define('streamer', { // 테이블명 streamers
        loginId: {
            type: DataTypes.STRING,
            allowNull: false,
            description : '로그인등에 사용되는 아이디'
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            description : '트위치 내부에서 사용되는 아이디 api 호출시 알아야 하는 정보'
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            description : '트위치 닉네임'
        },
        offlineImg : {
            type: DataTypes.STRING,
            allowNull: false,
            description : '트위치 오프라인이미지'
        },
        profileImg : {
            type: DataTypes.STRING,
            allowNull: false,
            description : '트위치 프로필이미지'
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
        live : {
            type : DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue : 0,
            description : '생방유무'
        }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });

    return Streamer;
  };