<template>
    <v-card class="mx-auto text-center">
        <v-card-text>
            <line-chart :chart-data="chartdate" :styles="myStyles"></line-chart>
        </v-card-text>
    </v-card>
</template>

<script>
import LineChart from "./LineChart";
export default {
    components : {
        LineChart
    },
    data() {
        return {
            chartdate : {}
        }
    },
	props : {
        height : {
            type : Number,
            default: 300,
        }
    },
    computed: {
        myStyles () {      
            return {
                height: `${this.height-100}px`,
                position: 'relative'
            }
        }
    },
}
</script>

<style>

</style>