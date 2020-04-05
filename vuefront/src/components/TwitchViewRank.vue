<template>
    <v-card class="mx-auto">
        <v-app-bar
            dark
            color="success"
            dense >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>시청순위</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small icon @click.prevent="pageEvent('prev')">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn small icon @click.prevent="pageEvent('next')">
                <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn icon @click.prevent="refreshClick">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </v-app-bar>
        <v-simple-table dense fixed-header :height="height-50" >
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">순위</th>
                <th class="text-left">스트리머</th>
                <th class="text-left">시청수</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item ,index) in list" :key="item.userName" @click="clickEvent(item.userName)">
                <td>{{(page-1) * 100 +index+1}}</td>
                <td>    
                    <v-avatar size=45>
                        <img
                            :src="item.profileImg"
                            :alt="item.userName"
                            class="pa-1"
                        >
                    </v-avatar>
                    {{ item.userName }}
                </td>
                <td>{{ item.views | currency }}</td>
                </tr>
            </tbody>
            </template>
            
        </v-simple-table>
        <v-overlay :value="overlay" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-card>
 
</template>

<script>
import { viewRank } from "../api";
import { mapActions } from "vuex";
import { snackbar } from "../mixins/snackbar";
export default {
    mixins: [snackbar],
    data() {
        return {
            list:[],
            overlay : true,
            page : 1
        }
    },
    props : {
        height : {
            type : Number,
            default: 300,
        }
    },
    created() {
        viewRank.list(this.page)
        .then(data=>{
            this.list = data.list;
            this.overlay = false;
        })
    },
    methods: {
        ...mapActions(['FETCH_STREAMER_CHART']),
        refreshClick(){
            this.overlay = true;
            this.page = 1;
            viewRank.list(this.page)
            .then(data=>{
                this.list = data.list;
                this.overlay = false;
            })
        },
        clickEvent(userName){
            this.FETCH_STREAMER_CHART({type :'week', option : 'view', userName, title : '시청변화'});
        },
        pageEvent(next){
            if(next=='next'){
                // 만명이 넘는 스트리머가 존재 하지만 서버 문제로 제한함
                // 전부 페이징 하기 위한 total 파악을 위한 db 조회는 성능이 좋은 서버 확보시에만 사용한다.
                if(this.page == 20) {
                    this.errorMessage('더이상 조회하실수 없습니다.');
                    return;
                }
                this.page++;
            }else{
                if(this.page ==1 ) {
                    this.alarmMessage('첫 페이지입니다.');
                    return;
                }
                this.page--;
            }
            this.overlay = true;
            viewRank.list(this.page)
            .then(data=>{
                this.list = data.list;
                this.overlay = false;
            }).catch(err=>{
                console.error(err);
                this.errorMessage('잠시후 다시 이용해 주세요');       
            })
        }
    }
}
</script>

<style>

</style>