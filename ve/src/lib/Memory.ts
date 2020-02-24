//ローカルストレージの読み書き(Jsonとの相互変換対応)
export default class Memory{
	//読込
	public static load<T>(key:string):T{
		return JSON.parse(localStorage[key]);
	}

	//保存
	public static save<T>(key:string,memory:T):void{
		localStorage.setItem(key,JSON.stringify(memory));
	}

	//削除
	public static remove<T>(key:string):void{
		localStorage.removeItem(key);
	}
}
