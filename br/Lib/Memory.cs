//ローカルストレージの読み書き(Jsonとの相互変換対応)
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.JSInterop;

class Memory{
	//読込
	public static async Task<T> load<T>(IJSRuntime js,string key){
		return JsonSerializer.Deserialize<T>(await js.InvokeAsync<string>(
			"localStorage.getItem",new[]{key}));
	}

	//保存
	public static async Task save<T>(IJSRuntime js,string key,T memory){
		await js.InvokeVoidAsync(
			"localStorage.setItem",new[]{key,JsonSerializer.Serialize<T>(memory)});
	}

	//削除
	public static async Task remove(IJSRuntime js,string key){
		await js.InvokeVoidAsync(
			"localStorage.removeItem",new[]{key});
	}
}
