<template>
  <v-card  class="mx-auto" >
    <v-app-bar color="deep-orange" dark dense>
		<v-app-bar-nav-icon></v-app-bar-nav-icon>
		<v-toolbar-title >팔로워증감순위</v-toolbar-title>
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
    <v-chip-group
		v-model="selection"
		mandatory
        active-class="deep-purple--text text--accent-4"
        class="pl-2"
    >
        <v-chip dense @click="refreshClick('day')">하루</v-chip>
        <v-chip dense @click="refreshClick('week')">일주일</v-chip>
        <v-chip dense @click="refreshClick('month')">한달</v-chip>
    </v-chip-group>
    <v-tabs>
      <v-tab>
        <v-icon left>mdi-emoticon-kiss-outline</v-icon>
        증가
      </v-tab>
      <v-tab>
        <v-icon left>mdi-emoticon-sad-outline</v-icon>
        감소
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-simple-table dense fixed-header :height="tableHeigth()">
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">순위</th>
                <th class="text-left">스트리머</th>
                <th class="text-left">증가</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item ,index) in pluslist" :key="item.userName" @click="clickEvent(item.userName)">
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
                <td>{{ item.count | currency }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
            <v-simple-table dense fixed-header :height="tableHeigth()" >
                <template v-slot:default>
                <thead>
                    <tr>
                    <th class="text-left">순위</th>
                    <th class="text-left">스트리머</th>
                    <th class="text-left">감소</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item ,index) in minuslist" :key="item.userName" @click="clickEvent(item.userName)">
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
                    <td>{{ item.count | currency }}</td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-overlay :value="overlay" absolute>
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card> 
</template>

<script>
import {followRank} from "../api";
import {mapActions} from "vuex";
import {snackbar} from "../mixins/snackbar";
export default {
    mixins: [snackbar],
    props : {
        height : {
            type : Number,
            default: 300,
        }
    },
    data() {
        return {
            pluslist:[],
            minuslist:[],
            overlay : true,
            type : 'day',
			page : 1,
            selection : 0,
            
        }
    },
    created() {
        followRank.priodList(this.type ,this.page)
        .then(data=>{
            this.pluslist = data.plus;
            this.minuslist = data.minus;
            this.overlay = false;
        })
    },
    methods: {
        ...mapActions(['FETCH_STREAMER_CHART']),
        tableHeigth(){
            return this.height -145;
        },
        refreshClick(type){
			this.page =1;
			this.selection =0;
			this.overlay = true;
			this.type = type;
            followRank.priodList(this.type ,this.page)
            .then(data=>{
                this.pluslist = data.plus;
                this.minuslist = data.minus;
                this.overlay = false;
            })
        },
        clickEvent(userName){
            this.FETCH_STREAMER_CHART({type : this.type ,option : 'follower', userName, title : '팔로워변화'});
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
            followRank.priodList(this.type ,this.page)
            .then(data=>{
				if(data.plus.length ==0 && data.minus.length ==0) this.$emit('alarmMessage', '데이터가 없습니다.')
				if(data.plus.length > 0) this.pluslist = data.plus;
				if(data.minus.length > 0) this.minuslist = data.minus;
                this.overlay = false;
            }).catch(err=>{
                console.error(err);
                this.errorMessage('잠시후 다시 이용해 주세요');
                
            });
        }
    },
}
</script>

<style>

</style>