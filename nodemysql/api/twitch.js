const db = require('../models');
const util = require('../util/util');
const superagent = require('superagent');
const dotenv = require('dotenv');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
dotenv.config();
moment.locale();

// 기간별 시청자수 일 주 달
const viewsPeriodRank = async(req, res)=>{
    try {
        const {type,page} = req.params;
        let now , pre;
        let start , end;
        let sql;
        let preArr=[] , afterArr=[] , list=[] ;

        start = ((page-1) * 100);
        end = page*100;
        now = moment().subtract(1,'days').format('YYYYMMDD');
        
        switch (type) {
            case 'week':
                pre = moment().subtract({days:1,weeks:1}).format('YYYYMMDD');
                break;
            case 'month':
                pre = moment().subtract({days:1,month:1}).format('YYYYMMDD');
                break;
            default:
                pre = moment().subtract(2,'days').format('YYYYMMDD');
                break;
        }

        sql = "SELECT" 
            +" bb.userName, aa.views, bb.profileImg"
            +" FROM twitchdailyinfos aa"
            +" USE INDEX (twitchdailyinfos_date_login_id)"
            +" JOIN streamers bb"
            +" ON aa.loginId = bb.loginId"
            +" WHERE aa.date = " + now ;
            +" and bb.fllower > 1000"

        afterArr = await db.sequelize.query(sql);

        sql = "SELECT" 
            +" bb.userName, aa.views, bb.profileImg"
            +" FROM twitchdailyinfos aa"
            +" USE INDEX (twitchdailyinfos_date_login_id)"
            +" JOIN streamers bb"
            +" ON aa.loginId = bb.loginId"
            +" WHERE aa.date = " + pre
            +" and bb.fllower > 1000"
          

        preArr = await db.sequelize.query(sql);

        loop : for (let i = 0; i < afterArr[0].length; i++) {
            for (let j = 0; j < preArr[0].length; j++) {
                if( afterArr[0][i].userName == preArr[0][j].userName){
                    afterArr[0][i].views = afterArr[0][i].views - preArr[0][j].views
                    list.push(afterArr[0][i]);
                    continue loop;
                }
            }
        }
        
        list.sort((a,b)=>{
            return b.views-a.views;
        })
   
        list = list.slice(start, end);        
        await res.json(list);

    } catch (error) {
        console.error(error);
        res.status(501)
    }
    
}
// 뷰 , 팔로워수 증감추이
const streamChart = async(req , res)=>{
    try {
        const {type , userName , option} = req.params;
        let sql = "";
        let begin , end;
        let labels =[] , labela = [];
        let values = [] , vala = [];
        // 날짜
        end = moment().subtract(1,'days').format('YYYYMMDD');
        switch (type) {
            case 'week':
                begin = moment().subtract({days:1,weeks:1}).format('YYYYMMDD');
                break;
            case 'month':
                begin = moment().subtract({days:1,month:1}).format('YYYYMMDD');
                break;
            default:
                begin = moment().subtract(4,'days').format('YYYYMMDD');
                break;
        }

        const dates = [moment(begin, 'YYYYMMDD'), moment(end, 'YYYYMMDD')];
        const range = moment.range(dates);
        let days = Array.from(range.by('day'));

        days.forEach(el => {
            labels.push(el.format('MM.DD'))
        });   
        // 쿼리
        if(option == 'view'){
            sql = "SELECT" 
                +"  bb.userName , aa.date ,  aa.views as count"
                +"  FROM twitchdailyinfos aa"
                +"  JOIN streamers bb"
                +"  ON aa.loginId = bb.loginId"
                +"  WHERE bb.userName = '" + userName +"'"
                +"  AND aa.date between " + begin +" and " + end
                +"  ORDER BY aa.date";
        }else if(option == 'follower'){
            sql = "SELECT" 
                +"  bb.userName , aa.date ,  aa.fllower as count"
                +"  FROM twitchdailyinfos aa"
                +"  JOIN streamers bb"
                +"  ON aa.loginId = bb.loginId"
                +"  WHERE bb.userName = '" + userName +"'"
                +"  AND aa.date between " + begin +" and " + end
                +"  ORDER BY aa.date";
        }
        if(sql.length ==0) await res.status(500).json({ error: '허용되는 타입이 아닙니다' });
        const results = await db.sequelize.query(sql);

        if(results[0].length == 0) await res.status(500).json({ error: '조회된 데이터가 없습니다.'});

        await results[0].forEach(el => {
            labela.push(moment(el.date, 'YYYYMMDD' ).format('MM.DD' ));
            values.push(el.count);
        });
        
        for (let i = 0; i < labels.length; i++) {
            let v1 = 0;
            for (let j = 0; j < labela.length; j++) {
                if(labels[i] == labela[j]) {
                    v1 = values[j];
                }
            }
            vala.push(v1);
        }
        values = [];
        values.push(0);
        for (let i = 1; i < vala.length; i++) {
            if(vala[i]==0 || vala[i-1]==0)values.push(0);
            else values.push(vala[i] - vala[i-1]); 
        }
        await res.json({labels : labels.slice(1) ,values : values.slice(1) , userName: results[0][0].userName });

    } catch (error) {
        console.error(error);
        res.status(501)
    }
}
// view 팔로워수 추이차트

// 팔로워 증감
const followPlus = async (req ,res) =>{
    try {
        const {type,page} = req.params;
        let now , pre;
        let start , end;
        let preArr=[] , afterArr=[] , plus=[] , minus =[];

        start = ((page-1) * 100);
        end = page*100;
        now = moment().subtract(1,'days').format('YYYYMMDD');
        
        switch (type) {
            case 'week':
                pre = moment().subtract({days:1,weeks:1}).format('YYYYMMDD');
                break;
            case 'month':
                pre = moment().subtract({days:1,month:1}).format('YYYYMMDD');
                break;
            default:
                pre = moment().subtract(2,'days').format('YYYYMMDD');
                break;
        }

        sql = "SELECT" 
            +" bb.userName, aa.fllower as count, bb.profileImg"
            +" FROM twitchdailyinfos aa"
            +" USE INDEX (twitchdailyinfos_date_login_id)"
            +" JOIN streamers bb"
            +" ON aa.loginId = bb.loginId"
            +" WHERE aa.date = " + now 
            +" and bb.fllower > 1000 AND aa.fllower > 0";

        afterArr = await db.sequelize.query(sql);

        sql = "SELECT" 
            +" bb.userName, aa.fllower as count, bb.profileImg"
            +" FROM twitchdailyinfos aa"
            +" USE INDEX (twitchdailyinfos_date_login_id)"
            +" JOIN streamers bb"
            +" ON aa.loginId = bb.loginId"
            +" WHERE aa.date = " + pre
            +" and bb.fllower > 1000 AND aa.fllower > 0";
          
        preArr = await db.sequelize.query(sql);
        loop : for (let i = 0; i < afterArr[0].length; i++) {
            for (let j = 0; j < preArr[0].length; j++) {
                if(afterArr[0][i].userName == preArr[0][j].userName){
                    if(afterArr[0][i].count - preArr[0][j].count > 0){
                        afterArr[0][i].count = afterArr[0][i].count - preArr[0][j].count;
                        plus.push(afterArr[0][i]);
                    }else if(afterArr[0][i].count - preArr[0][j].count < 0){
                        afterArr[0][i].count = afterArr[0][i].count - preArr[0][j].count;
                        minus.push(afterArr[0][i]);
                    }
                    continue loop;
                }
            }
        }

        plus.sort((a , b)=> b.count - a.count);
        minus.sort((a , b)=> a.count - b.count);
        plus = plus.slice(start , end);
        minus = minus.slice(start , end);

        await res.json({plus, minus});
    } catch (error) {
        console.error(error);
        res.status(501);
    }
}

// 팔로워 순위
const follow = (req, res) =>{
    const {page} = req.params;
    const size = 100;
    const list = db.Streamer.findAll({
            attributes: ['userName', 'fllower','profileImg'],
            offset : size * (page-1),
            limit: size,
            order : [[ 'fllower', 'desc']],
        }
    ).then(list=>{
        res.json({list});
    }).catch(err=>{
        console.error(err);
        res.status(404).json({list});
    })
}

// 총 시청순위
const viewRank = (req, res) =>{
    const {page} = req.params;
    const size = 100;
    const list = db.Streamer.findAll({
            attributes: ['userName', 'views','profileImg'],
            offset : size * (page-1),
            limit: size,
            order : [[ 'views', 'desc']],
        }
    ).then(list=>{
        res.json({list});
    }).catch(err=>{
        console.error(err);
        res.status(404).json({list});
    })
}

// 스트리머 정보 미리 보기나 여러 명 조회할때
const query = (req , res) =>{    
    const {userName} = req.params;
    const list = db.Streamer.findAll({
        where : {
            userName : {
                [db.Sequelize.Op.like] : `%${userName}%` 
            }
        }
    }).then(list=>{
        res.json({list});
    })
    .catch(err=>{
        console.error(err);
        res.status(404).json({list});
    })
}

// 단건의 스트리머 정보 조회시
const get = async(req , res) =>{
    const {userName} = req.params;
    const item = await db.Streamer.findOne({
        where : {userName}
    })
    if(!item) return res.status(404).end('스트리머가 존재 하지 않습니다.');
    res.json({item})
}

module.exports = { 
    get,
    query,
    follow,
    viewRank,
    followPlus,
    streamChart,
    viewsPeriodRank,
  }
