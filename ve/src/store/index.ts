import Vue from "vue";
import Vuex from "vuex";
import Item from "@/lib/Item";

Vue.use(Vuex);
export default new Vuex.Store({
	state:{
		lastUpdate: new Date(2000,0,1) as Date,
		playerNames: [] as string[],
		lretItems: {} as {[s:string]:Item},
		options: {} as {[s:string]:Item},
		limitCurrent: [] as string[],
		limitStorage: {} as {[s:string]:string},
		quests: {} as {[s:string]:Item}
	},
	mutations:{
		setLastUpdate(state,d:Date){
			state.lastUpdate=d;
		},
		setPlayerNames(state,names:string[]){
			state.playerNames=names;
		},
		setLretItems(state,items:{[s:string]:Item}){
			state.lretItems=items;
		},
		setOptions(state,items:{[s:string]:Item}){
			state.options=items;
		},
		setLimitCurrent(state,item:string[]){
			state.limitCurrent=item;
		},
		setLimitStorage(state,items:{[s:string]:string}){
			state.limitStorage=items;
		},
		setQuests(state,items:{[s:string]:Item}){
			state.quests=items;
		}
	}
});
