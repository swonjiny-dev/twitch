import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;
import { mapState } from 'vuex';
export default {
	extends: Line,
	mixins: [reactiveProp],
	props : {
        height : {
            type : Number,
            default: 300,
        }
	},
	computed : {
		// 확인! chartdate 내부 데이터 변화시 차트 갱신이 안되서 일단 dataset , labels 로 구분함 사유 확인필요
		...mapState({
			dataset(state){
				return state.streamFollowChart.dataset;
			},
			labels(state){
				return state.streamFollowChart.labels;
			},
		}),
	},
	data: () => ({
		chartdate: {
			labels: ['01.01', '01.02'],
			datasets: [
				{
					label: '스트리머',
					backgroundColor: '#f87979',
					data: [0, 0]
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false
		}
	}),

	// mounted  () {
	// 	this.renderChart(this.chartdate, this.options);
	// },

	watch: {
        dataset(val){     
			this.chartdate.datasets = val;
			
        },
        labels(val){
			this.chartdate.labels = val;
			this.renderChart(this.chartdate, this.options);
		},
    }
}