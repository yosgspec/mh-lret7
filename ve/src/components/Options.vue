<template>
<div id=options class=flex-center-col>
	<b>設定</b>
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
const delay=(ms:number):Promise<void>=>new Promise(res=>setTimeout(res,ms));

@Component
export default class Options extends Vue{
	private items:{[s:string]:Item}={
		"武器重複させない":     {isChecked:false, isDisabled:false},
		"武器を統一":           {isChecked:false, isDisabled:false},
		"縛り重複させない":     {isChecked:false, isDisabled:true},
		"縛りを統一":           {isChecked:false, isDisabled:true},
		"クリップボードに出力": {isChecked:false, isDisabled:false},
		"twitterに投稿":        {isChecked:false, isDisabled:false}
	};

	private watchClose=false;
	private async watchRun(){
		const keys:string[]=["武器","縛り"];
		const log:{[s:string]:boolean}={};
		for(;;){
			await delay(100);
			for(let key of keys){
				if(!(key in log) || log[key]!=store.state.lretItems[key].isChecked){
					log[key]=store.state.lretItems[key].isChecked;
					this.items[`${key}重複させない`].isDisabled=!log[key];
					this.items[`${key}を統一`].isDisabled=!log[key];
				}
			}
			if(this.watchClose) return;
		}
	}

	private async mounted(){
		await new Promise(res=>setTimeout(res,1));
		try{
			this.items=Memory.load("options");
		}
		catch{}
		this.setItems();
		this.watchRun();
	}

	private destroyed(){
		this.watchClose=true;
	}

	private switchItem(key:string){
		if(this.items[key].isChecked){
			if(key=="武器重複させない") this.items["武器を統一"].isChecked=false;
			else if(key=="武器を統一") this.items["武器重複させない"].isChecked=false;
			else if(key=="縛り重複させない") this.items["縛りを統一"].isChecked=false;
			else if(key=="縛りを統一") this.items["縛り重複させない"].isChecked=false;
		}
		this.setItems();
	}

	private setItems(){store.commit("setOptions",this.items);}
}
</script>
