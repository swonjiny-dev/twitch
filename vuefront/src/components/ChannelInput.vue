<template>
<v-container>
  <v-card height="370">
    <v-toolbar
        color="teal"
        dark
        dense
    >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>채널생성</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('delChanelCreate')">
            <v-icon>mdi-delete-forever-outline</v-icon>
        </v-btn>
    </v-toolbar>
        <v-list two-line subheader > 
            <v-subheader>채널아이디</v-subheader>
            <v-list-item>
                <!-- <v-text-field
                    v-model="channelId"
                    :counter="25"
                    :rules="nameRules"
                    label="스트리머ID"
                    required
                ></v-text-field> -->
                <v-autocomplete
                    v-model="name"
                    :loading="loading"
                    :items="items"
                    :search-input.sync="search"
                    item-text="userName"
                    item-value="userName"
                    flat
                    clearable
                    hide-no-data
                    hide-details
                    label="스트리머?"
                    solo
                    color = "deep-purple"
                >
                <template v-slot:item="{ item }">
                    <v-list-item-avatar
                        color="indigo"
                        class="headline font-weight-light white--text"
                    >   
                        <img
                            :src="item.profileImg"   
                        >
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.userName"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-chip v-if="item.live==1"
                            class="ma-1"
                            color="red"
                            text-color="white"
                            >
                        live
                        </v-chip>
                    </v-list-item-action>
                </template>
                </v-autocomplete>
            </v-list-item>
            <v-divider></v-divider>
        </v-list>
        <v-list
            subheader
            two-line
            flat
        >
            <v-subheader>보고싶은 영역 선택</v-subheader>
            <v-list-item>
                <v-radio-group v-model="viewOption" row>
                    <v-radio label="방송" value="stream"></v-radio>
                    <v-radio label="채팅" value="chat"></v-radio>
                </v-radio-group>
            </v-list-item>
        </v-list>
        <v-card-actions>
            <v-btn
                :disabled="!name"
                color="indigo"
                width="100%"
                @click="addClick"
                outlined
            >
                채널생성
            </v-btn>
        </v-card-actions>
  </v-card>
</v-container>
</template>

<script>
import {mapActions} from "vuex";
import {streamerInfo} from "../api";
export default {
    data() {
        return {
            name : '',
            loading: false,
            viewOption: 'stream' ,
            items: [],
            search : null,
            channelId : null,
        }
    },
    watch: {
        search(val){ 
            val && val !== this.name && this.querySelections(val) 
        } 
    },
    methods: {
        ...mapActions(['FETCH_STREAMER_LIST']),
        querySelections (v) {
            this.loading = true;
            this.items = [];
            setTimeout(() => {  
                streamerInfo.list(v)
                .then(data=>{
                    this.items = data.list;     
                    this.loading = false
                })
            }, 500)
      },
      addClick(){
        streamerInfo.list(this.name)
        .then((data)=>{
            this.$emit('addClick' , data.list[0].loginId , this.viewOption , this.name);
        })
      }
    },
}
</script>

<style>

</style>