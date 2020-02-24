//ルーレット処理ライブラリ
using System;
using System.Collections.Generic;
using System.Linq;
using Utils;
using XorShifts;

namespace LretUtils{
	//ルーレット設定用オブジェクト
	class PlayerItems{
		public int index=-1;
		//ルーレット対象リスト
		public string[] values;
		public string value{get{return values[index];}}
		//空白埋めリスト
		private string[] spaces;
		public string space{get{return spaces[index];}}

		//コンストラクタ
		public PlayerItems(string[] values){
			this.values=values;
			//空白埋めリストの生成
			int[] valuesLen=Array.ConvertAll(values,s=>Util.lenB(s));
			int valuesLenMax=valuesLen.Max();
			spaces=Array.ConvertAll(valuesLen,i=>Util.padStr("",i,valuesLenMax));
		}
	}

	//プレイヤークラス
	class Player{
		public string name;
		public Dictionary<string,PlayerItems> items;

		//ルーレット結果
		public string result{get{
			var res=name;
			var resSpace="";
			foreach(var (key,v) in items){
				if(0<=v.index){
					res+=$@"{resSpace}　{key}:{v.value}";
					resSpace=v.space;
				}
			}
			return res;
		}}

		//ルーレット結果(twitter)
		public string resultTwit{get{
			string res=name;
			foreach(var (key,v) in items){
				if(0<=v.index){
					res+=$@"　{key}:{v.value}";
				}
			}
			return res;
		}}

		//コンストラクタ
		public Player(string name,Dictionary<string,string[]> items){
			this.name=name;
			//与えられたリストをオブジェクト化
			this.items=items.ToDictionary(v=>v.Key,v=>new PlayerItems(v.Value));
		}
	}

	//ルーレット用関数
	static class Lret{
		//プレイヤー項目用ルーレット
		public static void item(
			List<Player> players, //プレイヤーリスト
			string[] lasts,       //プレイヤー毎の履歴リスト
			string[] itemList,    //ルーレット対象
			string key,           //ルーレット項目
			bool isOptionAll,     //項目の統一を行う?
			bool isOptionOnly,    //項目の重複をさせない?
			XorShift xs           //乱数ジェネレータ
		){
			//ルーレットが失敗した時もう一度
			for(;;){
			repeat:
				//履歴はルーレット対象は最低2つ以上存在する場合のみ参照する
				var isLastChk=2<=itemList.Length;

				//項目の統一させる場合、
				if(isOptionAll){
					int x=xs.randInt(0,itemList.Length-1);
					//全てのプレイヤーに等しく結果を代入
					//履歴は1人目のプレイヤーの物のみ参照する
					foreach(var (p,i) in players.Select((p,i)=>(p,i))){
						if(isLastChk && i==0 && lasts[0]==itemList[x]) goto repeat;
						p.items[key].index=x;
					}
					//履歴を更新
					for(int i=0;i<lasts.Length;i++) lasts[i]=players[0].items[key].value;
				}
				else{
					int[] xList;
					//項目の重複をさせない場合
					if(isOptionOnly && players.Count<itemList.Length){
						//重複しない乱数で結果を生成
						xList=Enumerable.Range(0,itemList.Length).ToArray();
						xList=xs.shuffle(xList);
					}
					//通常条件
					else{
						//通常の乱数
						xList=Enumerable.Range(0,players.Count)
							.Select(v=>xs.randInt(0,itemList.Length-1)).ToArray();
					}
					if(isLastChk){
						//履歴を参照して2連続で選択されるものがあればもう一回
						foreach(var (p,i) in players.Select((p,i)=>(p,i))){
							if(lasts[i]==itemList[xList[i]]) goto repeat;
						}
					}
					//ルーレット結果をプレイヤーに代入、履歴を更新
					foreach(var (p,i) in players.Select((p,i)=>(p,i))){
						p.items[key].index=xList[i];
						lasts[i]=p.items[key].value;
					}
				}
				return;
			}
		}

		//クエストルーレット
		public static string quest(List<string> questLasts,List<string> questList,XorShift xs){
			//履歴保存数
			int n;
			if(questLasts.Count==0 || questList.Count<=2)
				n=0;
			else if(questList.Count-1<=questLasts.Count)
				n=questList.Count-2;
			else if(questLasts.Count<10)
				n=questLasts.Count;
			else
				n=10;

			//履歴数調整
			questLasts.RemoveRange(0,questLasts.Count-n);

			//履歴に含まれるクエストは選択しない
			string quest;
			do{
				quest=questList[xs.randInt(0,questList.Count-1)];
			}while(2<=questList.Count && questLasts.Contains(quest));
			questLasts.Add(quest);

			return quest;
		}
	}
}
