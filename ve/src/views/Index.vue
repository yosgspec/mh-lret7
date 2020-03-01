<template>
<div class=home>
	<div class=page-title>MHWIルーレットVE</div>
	<hr>
	<div id=huntLret class=flex-center-col>
		<Toast ref="toast" />
		<div class=flex-center-col style="max-width:675px;width:100%;">
			<div style=max-width:500px>
				<p class=spacer><Players /></p>
				<p class=spacer><LretItems /></p>
				<p class=spacer><Options /></p>
				<p style="transition: all 500ms;" :class="{
					limitDisp: ('(edit)' in lretItems) && lretItems['(edit)'].isChecked,
					limitHide: !(('(edit)' in lretItems) && lretItems['(edit)'].isChecked)
				}">
					<Limits />
				</p>
				<p class=spacer><Quests /></p>
			</div>
			<p class="spacer flex-center"><button @click="lretRun">Let's ルーレット!</button></p>
			<p class="spacer flex-center">
				<textarea :value="result" ref="result"></textarea>
				<button @click="memoryClear">💣</button>
			</p>
		</div>
	</div>
</div>
</template>

<style scoped>
.limitDisp{
	max-height: 300px;
	opacity: 1;
	visibility: visible;
	margin: 0 0 20px 0;
}
.limitHide{
	max-height: 0;
	opacity: 0;
	visibility: hidden;
	margin: 0;
}
textarea{
	width: 100%;
	height: 12em;
}
.spacer{
	width: 100%;
	margin: 0 0 20px 0;
}
</style>

<script lang=ts>
import {Component,Vue} from "vue-property-decorator";
import Util from "@/lib/Util";
import {XorShift} from "@/lib/XorShift";
import {Player,Lret} from "@/lib/LretUtil";
import store from "@/store";
import Item from "@/lib/Item";
import Memory from "@/lib/Memory";

import Toast from "@/components/Toast.vue";
import Players from "@/components/Players.vue";
import LretItems from "@/components/LretItems.vue";
import Options from "@/components/Options.vue";
import Limits from "@/components/Limits.vue";
import Quests from "@/components/Quests.vue";

@Component({
	components:{
		Toast,
		Players,
		LretItems,
		Options,
		Limits,
		Quests
	}
})
export default class MHLret extends Vue{
	//バージョン情報
	private readonly appVersion=200219;

	$refs!:{
		toast: Toast,
		result: HTMLInputElement
	}
	private xs:XorShift=new XorShift();

	//状態プロパティ
	private get playerNames():string[]{return store.state.playerNames;}
	private get lretItems():{[s:string]:Item}{return store.state.lretItems;}
	private get options():{[s:string]:Item}{return store.state.options;}
	private get limitCurrent():string[]{return store.state.limitCurrent;}
	private get quests():{[s:string]:Item}{return store.state.quests;}

	//履歴
	private weaponLasts!:string[];
	private limitLasts!:string[];
	private questLasts:string[]=[];

	//Jsonデータ
	private readonly weapons:string[]=require("@/assets/data/weapons.json");
	private readonly questData:{[s:string]:{[s:string]:{[s:string]:string[]}}}=require("@/assets/data/questData.json");
	private result:string="ここに結果が表示されます。";

	//読込時処理
	private async mounted(){
		this.weaponLasts=new Array(this.playerNames.length).fill("");
		this.limitLasts=new Array(this.playerNames.length).fill("");

		//更新履歴
		var defaultLog:string[]=require("@/assets/data/defaultLog.json");
		//日付情報をストア
		store.commit("setLastUpdate",new Date(defaultLog[3].slice(0,-1)));
		this.result=defaultLog.join("\n");

		//バージョンが更新されていたら簡単な設定項目を削除する。
		var isReset=false;
		try{
			let ver=Memory.load<number>("$Version");
			if(ver<this.appVersion) isReset=true;
		}
		catch{
			isReset=true;
		}
		if(isReset){
			Memory.remove("lretItems");
			Memory.remove("options");
			Memory.remove("quests");
			Memory.save("$Version",this.appVersion);
			await this.$refs.toast.show("アプリ更新のため一部設定をリセットしました。");
		}
	}

	//ローカルストレージへ保存
	private saveAll(){
		Memory.save("playerNames",this.playerNames);
		Memory.save("lretItems",this.lretItems);
		Memory.save("options",this.options);
		Memory.save("limitCurrent",this.limitCurrent);
		Memory.save("quests",this.quests);
	}

	//Let's ルーレット!
	private async lretRun(){
		//プレイヤーリスト
		const playerNames=this.playerNames.filter(s=>s!="");
		const strLen:number[]=playerNames.map(s=>Util.lenB(s));
		var maxLen=Math.max(...strLen);
		for(let i=0;i<playerNames.length;i++){
			playerNames[i]=Util.padStr(playerNames[i],strLen[i],maxLen);
		}
		const players:Player[]=playerNames.map(
			v=>new Player(v,{
				武器: this.weapons,
				縛り: this.limitCurrent
			})
		);

		this.result="";
		var resultTwit="";

		//プレイヤー項目が選択される場合
		if(this.lretItems["武器"].isChecked || this.lretItems["縛り"].isChecked){
			//武器ルーレット
			if(this.lretItems["武器"].isChecked){
				Lret.item(
					players,
					this.weaponLasts,
					this.weapons,
					"武器",
					this.options["武器を統一"].isChecked,
					this.options["武器重複させない"].isChecked,
					this.xs);
			}

			//縛りルーレット
			if(this.lretItems["縛り"].isChecked && 0<this.limitCurrent.length){
				Lret.item(
					players,
					this.limitLasts,
					this.limitCurrent,
					"縛り",
					this.options["縛りを統一"].isChecked,
					this.options["縛り重複させない"].isChecked,
					this.xs);
			}

			//結果集計
			for(let p of players){
				this.result+=p.result+"\n";
				resultTwit+=p.resultTwit+"\n";
			}
		}

		//クエストルーレット
		if(this.lretItems["クエスト"].isChecked ){
			//クエストリストの構築
			let questList:string[]=[];
			let data=this.questData;
			let push=(key:string,ext:string[])=>
				questList.push.apply(questList,ext.map(s=>`【${key}】${s}`));

			for(let [key,obj] of Object.entries(this.quests)){
				if(["歴戦","多頭"].includes(key)) continue;
				if(obj.isChecked){
					let isExp=this.quests["歴戦"].isChecked;
					let isMeny=this.quests["多頭"].isChecked;

					if(key in data["通常"]["単体"])
						push(key,data["通常"]["単体"][key]);
					if(isMeny && (key in data["通常"]["多頭"]))
						push(key,data["通常"]["多頭"][key]);
					if(isExp && (key in data["歴戦"]["単体"])){
						push(key,data["歴戦"]["単体"][key].map(s=>`[歴戦]${s}`));
						if(isMeny && (key in data["歴戦"]["多頭"]))
							push(key,data["歴戦"]["多頭"][key].map(s=>`[歴戦]${s}`));
					}
				}
			}
			//クエストリストが空でなければルーレット実行
			if(0<questList.length){
				if(this.result!="") this.result+="\n";
				let quest=Lret.quest(this.questLasts,questList,this.xs);
				this.result+=`ターゲット:${quest}\n`;
				resultTwit+=`対象:${quest}`;
			}
		}

		//入力された設定を保続
		this.saveAll();

		if(this.options["クリップボードに出力"].isChecked){
			try{
				await Util.setClipBoard(this.result,this.$refs.result);
				await this.$refs.toast.show("クリップボードに結果を出力しました!");
			}
			catch{
				await this.$refs.toast.show("クリップボードへの書込に失敗しました...");
			}
		}

		if(this.options["twitterに投稿"].isChecked){
			Util.tweet(resultTwit);
		}
	}

	//アプリの更新で変化しうる項目の設定を削除
	private async memoryClear(){
		Memory.remove("lretItems");
		Memory.remove("options");
		Memory.remove("quests");
		Memory.save("$Version",this.appVersion);
		await this.$refs.toast.show("一部設定を爆破しました。リロードしてください。");
	}
}
</script>
