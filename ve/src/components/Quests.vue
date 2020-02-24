<template>
<div id=quests class=flex-center-col>
	<b>クエスト</b>
	<div class=flex-center><template v-for="(item,key) in items">
		<input type=checkbox
			:id="key"
			v-model="item.isChecked"
			:disabled="item.isDisabled"
			@change="switchItem(key)"
		><label
			:key="key"
			:for="key"
		>{{key}}</label>
	</template></div>
</div>
</template>

<script lang=ts>
import {Component,Vue} from "vue-property-decorator";
import store from "@/store";
import Item from "@/lib/Item";
import Memory from "@/lib/Memory";

@Component
export default class Quests extends Vue{
	private items:{[s:string]:Item}={
		"M★1":     {isChecked:true,  isDisabled:false},
		"M★2":     {isChecked:true,  isDisabled:false},
		"M★3":     {isChecked:true,  isDisabled:false},
		"M★4":     {isChecked:true,  isDisabled:false},
		"M★5":     {isChecked:true,  isDisabled:false},
		"M★6":     {isChecked:true,  isDisabled:false},
		"MR24-":    {isChecked:true,  isDisabled:false},
		"MR50-":    {isChecked:true,  isDisabled:false},
		"MR70-":    {isChecked:true,  isDisabled:false},
		"MR100-":   {isChecked:true,  isDisabled:false},
		"イベント": {isChecked:false, isDisabled:false},
		"歴戦":     {isChecked:true,  isDisabled:false},
		"多頭":     {isChecked:true,  isDisabled:false},
		"特殊":     {isChecked:false, isDisabled:false}
	};

	private async mounted(){
		await new Promise(res=>setTimeout(res,1));
		try{
			this.items=Memory.load("quests");
		}
		catch{}
		this.setItems();
	}

	private switchItem(key:string){
		this.setItems();
	}

	private setItems(){store.commit("setQuests",this.items);}
}
</script>
