//ルーレット処理ライブラリ
import Util from "@/lib/Util";
import {XorShift} from "@/lib/XorShift";
import Item from "@/lib/Item";

//ルーレット設定用オブジェクト
class PlayerItems{
	public index=-1;
	//ルーレット対象リスト
	public values:string[];
	public get value():string{return this.values[this.index];}
	//空白埋めリスト
	private spaces:string[];
	public get space():string{return this.spaces[this.index];}

	//コンストラクタ
	constructor(values:string[]){
		this.values=values;
		//空白埋めリストの生成
		let valuesLen=values.map(s=>Util.lenB(s));
		let valuesLenMax=Math.max(...valuesLen);
		this.spaces=valuesLen.map(i=>Util.padStr("",i,valuesLenMax));
	}
}

//プレイヤークラス
export class Player{
	public name:string;
	public items:{[s:string]:PlayerItems}={};

	//ルーレット結果
	public get result():string{
		var res=this.name;
		var resSpace="";

		for(let [key,v] of Object.entries(this.items)){
			if(0<=v.index){
				res+=`${resSpace}　${key}:${v.value}`;
				resSpace=v.space;
			}
		}
		return res;
	}

	//ルーレット結果(twitter)
	public get resultTwit():string{
		var res=this.name;

		for(let [key,v] of Object.entries(this.items)){
			if(0<=v.index){
				res+=`　${key}:${v.value}`;
			}
		}
		return res;
	}

	//コンストラクタ
	constructor(name:string,items:{[s:string]:string[]}){
		this.name=name;
		//与えられたリストをオブジェクト化
		Object.entries(items).forEach(([key,value])=>this.items[key]=new PlayerItems(value));
	}
}

//ルーレット用関数
export class Lret{
	//プレイヤー項目用ルーレット
	public static item(       //プレイヤーリスト
		players:Player[],     //プレイヤー毎の履歴リスト
		lasts:string[],       //ルーレット対象
		itemList:string[],    //ルーレット項目
		key:string,           //項目の統一を行う?
		isOptionAll:boolean,  //項目の重複をさせない?
		isOptionOnly:boolean, //乱数ジェネレータ
		xs:XorShift
	){
		//ルーレットが失敗した時もう一度
		repeat:
		for(;;){
			//履歴はルーレット対象は最低2つ以上存在する場合のみ参照する
			let isLastChk=2<=itemList.length;

			//項目の統一させる場合、
			if(isOptionAll){
				let x=xs.randInt(0,itemList.length-1);
				//全てのプレイヤーに等しく結果を代入
				//履歴は1人目のプレイヤーの物のみ参照する
				for(let [i,p] of players.entries()){
					if(isLastChk && i==0 && lasts[0]==itemList[x]) continue repeat;
					p.items[key].index=x;
				}
				//履歴を更新
				for(let i=0;i<lasts.length;i++) lasts[i]=players[0].items[key].value;
			}
			else{
				let xList:number[];
				//項目の重複をさせない場合
				if(isOptionOnly && players.length<itemList.length){
					//重複しない乱数で結果を生成
					xList=[...itemList.keys()];
					xList=xs.shuffle(xList);
				}
				//通常条件
				else{
					//通常の乱数
					xList=[...players.keys()]
						.map(v=>xs.randInt(0,itemList.length-1));
				}
				if(isLastChk){
					//履歴を参照して2連続で選択されるものがあればもう一回
					for(let [i,p] of players.entries()){
						if(lasts[i]==itemList[xList[i]]) continue repeat;
					}
				}
				//ルーレット結果をプレイヤーに代入、履歴を更新
				for(let [i,p] of players.entries()){
					p.items[key].index=xList[i];
					lasts[i]=p.items[key].value;
				}
			}
			return;
		}
	}

	//クエストルーレット
	public static quest(questLasts:string[],questList:string[],xs:XorShift):string{
		//履歴保存数
		var n:number;
		if(questLasts.length==0 || questList.length<=2)
			n=0;
		else if(questList.length-1<=questLasts.length)
			n=questList.length-2;
		else if(questLasts.length<10)
			n=questLasts.length;
		else
			n=10;

		//履歴数調整
		questLasts.splice(0,questLasts.length-n);

		//履歴に含まれるクエストは選択しない
		var quest:string;
		do{
			quest=questList[xs.randInt(0,questList.length-1)];
		}while(2<=questList.length && questLasts.includes(quest));
		questLasts.push(quest);

		return quest;
	}
}
