<template>
<div id=limits class=flex-center-col>
	<Toast ref="toast" />
	<span><b>縛リスト</b>(改行で区切り)</span>
	<textarea v-model="data" @blur="setItems"></textarea>
	<div class=flex-center style=align-items:stretch>
		<button @click="loadDefault">デフォルト</button>
		<span style="margin:0 0 0 50px;align-self:center;">リスト</span>
		<input class=datalist v-model="dataKey" list=data-key style=width:6em>
		<datalist id=data-key>
			<option v-for="(val,key) in datas">
				{{key}}
			</option>
		</datalist>
		<button style="margin:0 0 0 2px;" @click="load">読込</button>
		<button style="margin:0 0 0 2px;" @click="save">保存</button>
	</div>
</div>
</template>

<style scoped>
#limits{
	width: 100%;
}
textarea{
	margin: 5px 0;
	width: 100%;
	height: 12em;
}
button{
	margin: 2px;
}
</style>

<script lang=ts>
import {Component,Vue} from "vue-property-decorator";
import store from "@/store";
import Memory from "@/lib/Memory";

import Toast from "@/components/Toast.vue";

@Component({
	components:{
		Toast
	}
})
export default class Limits extends Vue{
    $refs!:{toast: Toast}
	private dataDefault:string=require("@/assets/data/limitDefault.json").join("\n");
	private data="";
	private dataKey="";
	private datas:{[s:string]:string}={};

	private mounted(){
		try{
			this.data=Memory.load<string[]>("limitCurrent").join("\n");
		}
		catch{
			this.data=this.dataDefault;
		}
		try{
			this.datas=Memory.load("limitStorage");
		}
		catch{}
		this.setItems();
	}

	private async save(){
		if(this.dataKey=="") this.dataKey="default";
		this.datas[this.dataKey]=this.data;
		Memory.save("limitStorage",this.datas);
		this.setItems();
		await this.$refs.toast.show(`縛リスト「${this.dataKey}」を保存しました!`);
	}

	private async load(){
		if(this.dataKey in this.datas){
			this.data=this.datas[this.dataKey];
			this.setItems();
			await this.$refs.toast.show(`縛リスト「${this.dataKey}」を読み込みました!`);
		}
		else{
			await this.$refs.toast.show(`縛リスト「${this.dataKey}」が見つかりません...`);
		}
	}

	private async loadDefault(){
		this.data=this.dataDefault;
		this.setItems();
		await this.$refs.toast.show("縛リストを初期化しました。");
	}

	private setItems(){
		store.commit("setLimitCurrent",this.data.split(/\n/).filter(v=>v!=""));
		store.commit("setLimitStorage",this.datas);
	}
}
</script>
