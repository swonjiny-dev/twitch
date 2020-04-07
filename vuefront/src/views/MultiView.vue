<template>
    <grid-layout
        :layout.sync="layout"
        :col-num="12"
        :row-height="190"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :use-css-transforms="true">
        <div v-for="item in layout" :key="item.i">
        <grid-item
            v-if="item.i!='insert'"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            @resized="resizedEvent"
            >
            <v-card>
                <v-app-bar
                    dark
                    color="pink"
                    dense >
                    <v-app-bar-nav-icon></v-app-bar-nav-icon>
                    <v-toolbar-title> {{item.streamName}} </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="delWidget(item.streamer , item.option)">
                        <v-icon>mdi-minus-circle-outline</v-icon>
                    </v-btn>
                </v-app-bar>
                <twitch-channel v-if="item.option=='stream'"
                    :channel="item.streamer" 
                ></twitch-channel>
                <twitch-chat v-if="item.option=='chat'"
                    :channel="item.streamer" 
                ></twitch-chat>
            </v-card>
        </grid-item>
         <grid-item
            v-else
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            :is-resizable="false"
            >
            <ChannelInput @addClick="addClick"/>
            </grid-item>
      </div>
    </grid-layout>
</template>
<script>
import VueGridLayout from 'vue-grid-layout';
//import VueTwitchPlayer from 'vue-twitch-player';
import ChannelInput from "../components/ChannelInput";
import TwitchChannel from "../components/TwitchChannel";
import TwitchChat from "../components/TwitchChat";
import { mapState, mapMutations} from 'vuex'
export default {
    created() {
        document.title = "멀티트위치";
    },
    components : {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        //TwitchPlayer : VueTwitchPlayer,
        ChannelInput,
        TwitchChannel,
        TwitchChat
    },
    computed: {
        ...mapState([
            'layout',
        ]),
    },
    data() {
        return {
            // layout : [
            //   {"x":0,"y":0,"w":4,"h":2,"i":"insert" , "streamer" : "" , "option" : ""}
            // ],
            draggable: true,
            resizable: true,
        }
    },
    methods: {
        ...mapMutations([
            'SET_LAYOUT',
            'REMOVE_LAYOUT'
        ]),
        addClick(channelId , viewOption ,streamName){     
            const item =  this.layout.filter(el=> el.i==channelId+viewOption);
            if(item.length >0)return;
            this.SET_LAYOUT({"x":0,"y":0,"w":4,"h":2,"i":channelId+viewOption, "streamer" : channelId , "option" : viewOption, "streamName" : streamName});
       },
        /* eslint-disable */
        resizedEvent(i, newH, newW, newHPx, newWPx){
            const item = this.layout.filter((item)=>{
                return item.i ===i;
            })
            document.querySelector("iframe#"+item[0].i).height = newHPx-60;
        },
        // 위젯 삭제하기
        delWidget(channelId, option){
            let index = this.layout.findIndex((item)=>{
                return item.streamer == channelId && item.option == option;
            });
            this.REMOVE_LAYOUT(index);
       }
    },
}
</script>

<style>
iframe{
	top : 0;
	left : 0;
	width : 100%;
	/* height : 100%; */
}
.vue-grid-item>.vue-resizable-handle {
    width: 10px;
    height: 10px;
    background-color: blueviolet;
}
</style>