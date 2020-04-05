const express = require('express');
const api = require('../api/twitch');
const router = express.Router();

router.get('/streamerSearch/:userName',api.query);
router.get('/followRank/:page',api.follow);
router.get('/viewRank/:page',api.viewRank);
router.get('/followPlus/:type/:page',api.followPlus);
router.get('/streamChart/:type/:option/:userName' , api.streamChart);
router.get('/viewsePriodRank/:type/:page' , api.viewsPeriodRank);

module.exports = router;