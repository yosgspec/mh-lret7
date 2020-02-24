using System;
using System.Text.Json;
using System.Collections.Generic;

public class AppState{
	public DateTime lastUpdate{get;private set;}=new DateTime(2000,1,1);
	public string[] playerNames{get;private set;}=new string[]{};
	public Dictionary<string,Item> lretItems{get;private set;}=new Dictionary<string,Item>{};
	public Dictionary<string,Item> options{get;private set;}=new Dictionary<string,Item>{};
	public string[] limitCurrent{get;private set;}=new string[]{};
	public Dictionary<string,string> limitStorage{get;private set;}=new Dictionary<string,string>{};
	public Dictionary<string,Item> quests{get;private set;}=new Dictionary<string,Item>{};

	public void setLastUpdate(DateTime d){
		lastUpdate=d;
		NotifyStateChanged();
	}
	public void setPlayerNames(string[] names){
		playerNames=names;
		NotifyStateChanged();
	}
	public void setLretItems(Dictionary<string,Item> items){
		lretItems=items;
		NotifyStateChanged();
	}
	public void setOptions(Dictionary<string,Item> items){
		options=items;
		NotifyStateChanged();
	}
	public void setLimitCurrent(string[] item){
		limitCurrent=item;
		NotifyStateChanged();
	}
	public void setLimitStorage(Dictionary<string,string> items){
		limitStorage=items;
		NotifyStateChanged();
	}
	public void setQuests(Dictionary<string,Item> items){
		quests=items;
		NotifyStateChanged();
	}

	public event Action OnChange;
	private void NotifyStateChanged()=>OnChange?.Invoke();
}
