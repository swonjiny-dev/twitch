const db = require('../models');
const util = require('../utile/util');
const dotenv = require('dotenv');
const moment = require('moment');
const superagent = require('superagent');
const logger = require('../config/logConfig');
dotenv.config();
moment.locale();
const clinetId = process.env.twitch_clinetId;

// 스트리머 정보 호출저장 - 나중에 서버 배포시 스케줄적용 한다.
const streamInfoCall = async (count)=>{
    logger.info('스트리머 정보 호출저장');
    try {
        await db.Streamer.update({ live:0 } , { where : { live:1} } );
        if(!count) count =20;
        const nowdate = moment().format('YYYYMMDD');
        let url = 'https://api.twitch.tv/helix/streams?first=100&language=ko';
        let pageCursor = '', userIdparam = "", userId = "",userName = "",loginId = "",views = 0 , live = 0,
        offlineImg = "", profileImg = "";
        for (let j = 0; j < count; j++) {
            userIdparam = "";
            let resData = await superagent
            .get(url)
            .set('Client-ID' , clinetId)
            if(!resData) return 'noData';
            else userIdparam = "id="+resData.body.data[0].user_id;
            pageCursor = resData.body.pagination.cursor;
            if(!pageCursor) return 'ok';
            url = `https://api.twitch.tv/helix/streams?first=50&language=ko&after=${pageCursor}`;
            for (let index = 1; index < resData.body.data.length; index++) {
                userIdparam += `&id=${resData.body.data[index].user_id}`;
                // 전체 뷰수정보 입력 확인도 여기서 한다.
                const followerViewinfo = await db.Twitchdailyinfo.findOne({
                    where : {
                        loginId : resData.body.data[index].user_name , 
                        date : nowdate
                    }
                });
                if(followerViewinfo){
                    if(followerViewinfo.views < resData.body.data[index].viewer_count){
                        await logger.info(followerViewinfo.loginId + "-" + resData.body.data[index].viewer_count);
                        await followerViewinfo.update({views : resData.body.data[index].viewer_count});
                    }
                }
            }
            // 닉네임을 얻어오는 과정
            let resData1 = await superagent
                .get(`https://api.twitch.tv/helix/users?${userIdparam}`)
                .set('Client-ID' , clinetId);
            for (let index = 0; index < resData1.body.data.length; index++) {
                userId = resData1.body.data[index].id;
                userName = resData1.body.data[index].display_name;
                loginId = resData1.body.data[index].login;
                views = resData1.body.data[index].view_count;
                offlineImg = resData1.body.data[index].offline_image_url;
                profileImg = resData1.body.data[index].profile_image_url;

                for (let a = 0; a < resData.body.data.length; a++) {
                    if(resData1.body.data[index].id == resData.body.data[a].user_id){
                        if(resData.body.data[a].type == 'live') live = 1;
                        else live = 0;
                    }
                }

                // 신규입력 수정
                const stremerInfo = await db.Streamer.findOne({where : {userId}});            
                if(stremerInfo){
                    await stremerInfo.update({userName ,views , offlineImg , profileImg ,live });
                    await stremerInfo.save();
                }else{
                    await db.Streamer.create({loginId,userId,userName ,views,offlineImg,profileImg,live});
                }
            }
            await util.sleep(5000);
        }
        return 'ok';
    } catch (error) {
        logger.error( "stream -" + error);
        return 'err';
    }
}

// 이미 존재하는 스트리머 목록에서  follower view 수정
const followsSchedule = async()=>{   
    try {
        logger.info('시작 followsSchedule');
        let furl = "";
        let resData, preData;
        let flag=false;
        const nowdate = await moment().format('YYYYMMDD');
        const userList = await db.Streamer.findAll( {order: [['fllower' , 'desc']]});
        loop : for (let index = 0; index < userList.length; index++) {
            flag = false;
            preData = await db.Twitchdailyinfo.findOne({
                where : {
                    loginId : userList[index].loginId,
                    date : nowdate
                },
            });

            if(preData){
                if(preData.fllower > 0)continue loop;
                else flag = true;
            }
 
            furl = `https://api.twitch.tv/helix/users/follows?to_id=${userList[index].userId}&first=1`;
            resData = await superagent
            .get(furl)
            .set('Client-ID' , clinetId);
            if(resData){
                // 방송 정지당한 경우 숫자가 0 으로 전달된다.
                if(resData.body.total>0){
                    await db.Streamer.update({fllower : resData.body.total} , {
                        where : {
                            loginId : userList[index].loginId
                        }
                    });
                    if(flag){
                        await db.Twitchdailyinfo.update({ fllower : resData.body.total} , {
                            where : {
                                loginId : userList[index].loginId,
                                date : nowdate
                            }
                        });
                    }else{
                        await db.Twitchdailyinfo.create({
                            date : nowdate,
                            fllower : resData.body.total,
                            loginId : userList[index].loginId
                        })
                    }
                }
            }
            await util.sleep(3000);
        }
        logger.info('종료 followsSchedule');
    } catch (error) {
        logger.error("followsSchedule - " + error);
        return 'err';
    }
}

const viewSchedule = async()=>{   
    try {
        logger.info('시작 viewSchedule');
        const nowdate = await moment().format('YYYYMMDD');
        const userList = await db.Streamer.findAll();
        let url = "https://api.twitch.tv/helix/users?";
        let viewData;
        let userIdparam = "";
        for (let index = 0; index <= userList.length/100; index++) {
            userIdparam = "login="+userList[index*100].loginId;
            for (let j = 1; j < 100; j++) {
                if(userList[index*100+j]) userIdparam += "&login="+userList[index*100+j].loginId;
            }

            viewData = await superagent
                .get(url+userIdparam)
                .set('Client-ID' , clinetId);
            for (let a = 0; a < viewData.body.data.length; a++) {
                let views = viewData.body.data[a].view_count;
                if(views == 0){
                    let preData = await db.Twitchdailyinfo.findAll({
                        where : {
                            views: {
                                [db.Sequelize.Op.gt]: 0
                            },
                            loginId : userList[index].loginId
                        },
                        order: [['date' , 'desc']],
                        limit: 1
                    });
                    if(preData) views =preData[0].views;
                }
                await db.Streamer.update({views} , {
                    where : {
                        loginId : viewData.body.data[a].login
                    }
                });   
                const temp = await db.Twitchdailyinfo.findOne({
                    where : {
                        loginId : viewData.body.data[a].login,
                        date : nowdate
                    }
                }) ;  
                if(temp){
                    await db.Twitchdailyinfo.update({views} , {
                        where : {
                            loginId : viewData.body.data[a].login,
                            date : nowdate
                        }
                    })
                }else{
                    await db.Twitchdailyinfo.create({
                        date : nowdate,
                        views,
                        loginId : viewData.body.data[a].login,
                    })
                }
            }
            await util.sleep(3000);
        } 
        logger.info('종료 viewSchedule');
    } catch (error) {
        logger.error( "viewSchedule -" + error);
        return 'err';
    }
}

module.exports = { 
    streamInfoCall,
    followsSchedule,
    viewSchedule,
}