<template>
<main v-cloak>
	<router-view/>
	<div id=nav>
		<NavMenu/>
	</div>
</main>
</template>

<style>
[v-cloak]{
	display:none;
}
</style>

<script lang:ts>
import {Component,Vue} from "vue-property-decorator";
import NavMenu from "@/components/NavMenu.vue";

@Component({
	components:{
		NavMenu
	}
})
export default class App extends Vue{}
</script>
