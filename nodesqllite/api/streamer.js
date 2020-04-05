const models = require('../models');
const util = require('../util')
const superagent = require('superagent');
const dotenv = require('dotenv');
dotenv.config();
const clinetId = process.env.clinetId; // 나중에 dotenv 으로 옮겨라

//const acceptHeader = "application/vnd.twitchtv.v5+json";

// 스트리머 정보 미리 보기나 여러 명 조회할때
const query = (req , res) =>{
    console.log(1);
    
    const {userName} = req.params;
    const list = models.Streamer.findAll({
        where : {
            userName : {
                [models.Op.like] : `%${userName}%` 
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
    const item = await models.Streamer.findOne({
        where : {userName}
    })
    if(!item) return res.status(404).end('스트리머가 존재 하지 않습니다.');
    res.json({item})
}

// 스트리머 정보 갱신용
const createCall = async(_, res)=>{
    let code = '';
    code = streamInfoCall(5);
    if(code == 'err'){
        return res.status(404).end('스트리머가 존재 하지 않습니다.');
    }
    if(code == 'noData'){
        return res.status(404).end('트위치 정보가 없습니다.');
    }
    res.status(201).end();
}
// 스트리머 정보 호출저장 - 나중에 서버 배포시 스케줄적용 한다.
const streamInfoCall = async (count)=>{
    try {
        let url = 'https://api.twitch.tv/helix/streams?first=100&language=ko';
        let pageCursor = '';
        for (let j = 0; j < count; j++) {
            if(j > 0){
                url = `https://api.twitch.tv/helix/streams?first=100&language=ko&after=${pageCursor}`
            }
            const resData = await superagent
            .get(url)
            .set('Client-ID' , clinetId)
            if(!resData) return noData;
            
            for (let index = 0; index < resData.body.data.length; index++) {
                const userId = resData.body.data[index].user_id;
                const userName = resData.body.data[index].user_name;
                const stremerInfo = await models.Streamer.findOne({where : {userId}});   
                if(stremerInfo)
                {
                    if(stremerInfo[userName] != userName) {
                        stremerInfo[userName] = userName;
                        await stremerInfo.save();
                    }
    
                }else{
                    const loginData = await superagent
                    .get(`https://api.twitch.tv/helix/users?id=${userId}`)
                    .set('Client-ID' , clinetId)
                    const loginId = loginData.body.data[0].login;
                    const streamer = await models.Streamer.build({loginId,userId,userName});
                    await streamer.save();
                    await util.sleep(3000);
                }
            }            
            pageCursor = resData.body.pagination.cursor;
            if(!pageCursor) return 'ok';
        }
        return 'ok';
       
    } catch (error) {
        console.error(error);
        return 'err';
    }
}

module.exports = { 
    get, 
    createCall,
    query
  }