<template>
	<v-app>
		<AppBar></AppBar>
		<v-content class="mb-12">
			<router-view></router-view>
		</v-content>
		<AppFooter></AppFooter>
	</v-app>
</template>

<script>
import AppBar from "./components/AppBar";
import AppFooter from "./components/AppFooter";

export default {
	name: 'App',
	components : {
		AppBar,
		AppFooter
	}
}
</script>
