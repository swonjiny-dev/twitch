const schedule = require('node-schedule');
const api = require('./api/twitch');
const logger = require('./config/logConfig');
api.followsSchedule()
//api.viewSchedule()
//api.streamInfoCall(50);
const job1 = schedule.scheduleJob('0 */10 * * * *' , ()=>{
    logger.info('job1 streamInfoCall')    
    try {
        api.streamInfoCall(50);
    } catch (error) {
        logger.error(error)
    }
});

const job2 = schedule.scheduleJob('0 0 */3 * * *' , ()=>{
    logger.info('job2 followsSchedule');
    try {
        api.followsSchedule();
    } catch (error) {
        logger.error(error)
    }
})

const job3 = schedule.scheduleJob('0 10 */1 * * *' , ()=>{
    logger.info('job3 viewSchedule');
    try {
        api.viewSchedule();
    } catch (error) {
        logger.error(error)
    } 
 })