import axios from 'axios'

const DOMAIN = 'http://localhost:80/';
//const DOMAIN = '/'; // 배포시 변경함

const request = (method, url, data) => {
    return axios({
        method, 
        url: DOMAIN + url, 
        data
    }).then(result => result.data)
    .catch(result => { 
        throw result.response
    })
}
// 스트리머 정보목록(닉네임, 아이디, 생방송유무)
export const streamerInfo = {
    list(name){        
       return request('get' , `twitch/streamerSearch/${name}`)
    }
} 
// 팔로워수 전체 목록 , 기간별 목록
export const followRank = {
    list(page){        
        return request('get' , `twitch/followRank/${page}`)
    },
    priodList(type,page){
        return request('get' , `twitch/followPlus/${type}/${page}`)
    }
}
// 시청수 전체 목록 , 기간별목록 day , week , month
export const viewRank = {
    list(page){        
            return request('get' , `twitch/viewRank/${page}`)
    },
    priodList(type,page){
        return request('get' , `twitch/viewsePriodRank/${type}/${page}`)
    }
} 

// 스트리머별 시청수 , 팔로워수 추이
export const streamerChart = (userName ,type , option) => {   
    return request('get',`twitch/streamChart/${type}/${option}/${userName}`);
}