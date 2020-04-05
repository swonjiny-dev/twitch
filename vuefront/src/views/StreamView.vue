<template>
    <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="100"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :use-css-transforms="true">
        <grid-item 
            v-for="item in layout"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :key="item.i" 
                @resized="resizedEvent"
        >
            <TwitchFollowerRank @alarmSnack="alarmSnack" @errorSnack="errorSnack" id="followerRank" :height="fheight" v-if="item.option=='followerRank'"/>
            <TwitchViewRank @alarmSnack="alarmSnack" @errorSnack="errorSnack" :height="vheight" v-if="item.option=='viewRank'"/>
            <TwitchViewPeriodRank @alarmSnack="alarmSnack" @errorSnack="errorSnack" :height="vpheight" v-if="item.option=='viewPeriodRank'"/>
            <TwitchFollowPlus @alarmSnack="alarmSnack" @errorSnack="errorSnack" :height="ppheight" v-if="item.option=='TwitchFollowPlus'"/>
            <TwitchFollowChart :height="fcheight" v-if="item.option=='TwitchChart'"/>
        </grid-item>   
        <v-snackbar
            v-model="asnackbar"
            :timeout="timeout"
            top
        >
            {{ alarmtext }}
            <v-btn
                color="blue"
                text
                @click="asnackbar = false"
            >
            Close
            </v-btn>
        </v-snackbar>
        <v-snackbar
            v-model="esnackbar"
            :timeout="timeout"
            top
            color="red"
            >
            {{ errortext }}
            <v-btn
                text
                @click="esnackbar = false"
            >
            Close
            </v-btn>
        </v-snackbar>          
    </grid-layout>
</template>
<script>
import TwitchFollowerRank from "../components/TwitchFollowerRank";
import TwitchViewRank from "../components/TwitchViewRank";
import TwitchFollowPlus from "../components/TwitchFollowPlus";
import TwitchFollowChart from "../components/TwitchFollowChart";
import TwitchViewPeriodRank from "../components/TwitchViewPeriodRank";
export default {
    components : {
        TwitchFollowerRank,
        TwitchViewRank,
        TwitchFollowPlus,
        TwitchFollowChart,
        TwitchViewPeriodRank
    },
    data() {
        return {
            layout : [],
            draggable: true,
            resizable: false,
            fheight : 540,
            vheight : 540,
            vpheight : 540,
            ppheight : 535,
            fcheight : 550,
            timeout: 2000,
            asnackbar: false,
            esnackbar: false,
            alarmtext: '',
            errortext: '',
        }
    },
    created() {
        this.layout = [];
        this.layout.push({"x":0,"y":0,"w":3,"h":5,"i":"followerRank" , "option" : "followerRank"});
        this.layout.push({"x":3,"y":0,"w":3,"h":5,"i":"viewRank" , "option" : "viewRank"});
        this.layout.push({"x":6,"y":0,"w":3,"h":5,"i":"TwitchFollowPlus" , "option" : "TwitchFollowPlus"});
        this.layout.push({"x":9,"y":0,"w":3,"h":5,"i":"viewPeriodRank" , "option" : "viewPeriodRank"});
        this.layout.push({"x":6,"y":5,"w":6,"h":5,"i":"TwitchChart" , "option" : "TwitchChart"});
    },
    methods: {
        /* eslint-disable */
        resizedEvent(i, newH, newW, newHPx, newWPx){
            if(i=="followerRank") this.fheight = newHPx;
            if(i=="viewRank") this.vheight = newHPx;
            if(i=="viewPeriodRank") this.vpheight = newHPx;
            if(i=="TwitchFollowPlus") this.ppheight = newHPx;
            if(i=="TwitchChart") this.fcheight = newHPx;
        },
        alarmSnack(msg){
            this.asnackbar = !this.asnackbar;
            this.alarmtext = msg;
        },
        errorSnack(msg){
            this.esnackbar = !this.esnackbar;
            this.errortext = msg
        }
    },
}
</script>

<style>

</style>