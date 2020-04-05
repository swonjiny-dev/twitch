<template>
    <v-card class="mx-auto">
        <v-app-bar
            dark
            color="success"
            dense >
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>{{this.widgetName}}</v-toolbar-title>
        </v-app-bar>
        <v-container>
            <lineChart :height="height-20"/>
        </v-container>
        <v-overlay :value="overlay" absolute>
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-card>
</template>
<script>
import VueLineChart from "../components/chart/VueLineChart";
import { mapState } from 'vuex';
export default {
    components: {
      lineChart : VueLineChart
    },
    computed : mapState({
        dataset(state){
            return state.streamFollowChart.dataset;
        },
        title(state){
            return state.streamFollowChart.title;
        }
    }),
    watch: {
        'dataset' : function(){
			this.overlay = false;
        },
        'title' : function(val){
            this.widgetName = val;
        }
    },
    props : {
        height : {
            type : Number,
            default: 300,
        }
    },
    data() {
        return {
            overlay : true,
            widgetName : '스트리머를 선택해보세요'
        }
    },
}
</script>

<style>

</style>