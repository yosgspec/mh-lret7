<template>
<div id=lretItems class=flex-center-col>
	<b>ルーレット項目</b>
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
export default class LretItems extends Vue{
	private items:{[s:string]:Item}={
		"武器":       {isChecked:true,  isDisabled:false},
		"クエスト":   {isChecked:true, isDisabled:false},
		"縛り":       {isChecked:false, isDisabled:false},
		"(edit)":     {isChecked:false, isDisabled:false}
	};

	private async mounted(){
		await new Promise(res=>setTimeout(res,1));
		try{
			this.items=Memory.load("lretItems");
		}
		catch{}
		this.setItems();
	}

	private switchItem(key:string){
		this.setItems();
	}

	private setItems(){store.commit("setLretItems",this.items);}
}
</script>
