<template>
<div id=players class=flex-center-col>
	<b>プレイヤー名</b>
	<input v-for="(name,i) in names"
		type=text
		:placeholder="`[ハンター${i+1}]`"
		v-model="names[i]"
	>
</div>
</template>

<style scoped>
input{
	width: 12em;
	margin: 2px 0 0 0;
}
</style>

<script lang=ts>
import {Component,Vue} from "vue-property-decorator";
import store from "@/store";
import Memory from "@/lib/Memory";

@Component
export default class Players extends Vue{
	public names:string[]=[...Array(4).keys()].map(i=>"ハンター"+(i+1));

	public mounted(){
		try{
			this.names=Memory.load("playerNames");
		}
		catch{}
		this.setItems();
	}

	public setItems(){store.commit("setPlayerNames",this.names);}
}
</script>
