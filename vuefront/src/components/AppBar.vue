<template>
    <v-app-bar
		app
		color="deep-purple"
		dark
    >
		<v-btn text href="/MultiView">멀티트위치</v-btn>
		<v-btn text href="/StreamView">스트리머정보</v-btn>
		<v-spacer></v-spacer>
		<v-btn icon @click="addCreateInput">
			<v-icon>mdi-tab-plus</v-icon>
		</v-btn>
    </v-app-bar>

</template>
<script>
export default {
    methods: {
		addCreateInput(){
			this.$emit('inputCreate')
		}
    },
}
</script>

<style>

</style>