const schedule = require('node-schedule');
const api = require('./api/twitch');

const job1 = schedule.scheduleJob('0 1 * * * *' , ()=>{
    //api.streamInfoCall(10);    
});

const job2 = schedule.scheduleJob('0 0 */2 * * *' , ()=>{
   //api.followsSchedule();
})

const job3 = schedule.scheduleJob('0 30 */2 * * *' , ()=>{
    //api.viewSchedule();
 })