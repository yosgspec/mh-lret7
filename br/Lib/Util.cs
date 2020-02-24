//雑務クラス
using System;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Utils{
	static public class Util{
		//空白埋め
		public static string padStr(string str,int strLen,int maxLen){
			var target=maxLen-strLen;
			str+=new String('　',(int)target/2);
			if(target%2!=0) str+=" ";
			return str;
		}

		//文字幅取得
		public static int lenB(string str){
			var len=0;
			foreach(char chr in str){
				int cc=Convert.ToInt32(chr);
				if(
					0x0000<=cc && cc<=0x024F &&
					cc!=0x0085 && cc!=0x089 && cc!=0x00A7 && cc!=0x00B0 &&
					cc!=0x00B1 && cc!=0x00D7 && cc!=0x00F7 ||
					cc==0xA5 || cc==0x203E || cc==0xF8F0 ||
					0xFF61<=cc && cc<=0xFFDC ||
					0xFFE8<=cc && cc<=0xFFEE
				){
					len+=1;
				}
				else{
					len+=2;
				}
			}
			return len;
		}

		//クリップボードへ保存
		public static async Task setClipBoard(IJSRuntime js,string value,string id){
			try{
				await js.InvokeVoidAsync("navigator.clipboard.writeText",value);
			}
			catch{
				await Task.Delay(1);
				await js.InvokeVoidAsync("window.eval",new[]{$@"
					const ele=document.getElementById('{id}');
					if(navigator.userAgent.match(/ipad|ipod|iphone/i)){{
						window.getSelection().addRange(
							window.document.createRange().selectNode(ele));
					}}
					else{{
						ele.select();
					}}
					document.execCommand('copy');
					window.getSelection().removeAllRanges();
				"});
			}
		}

		//twitter用呟きウィンドウを表示
		//確定エラーを起こすので取り扱いに注意する(処理の流れが止まってしまう)
		public static async Task tweet(IJSRuntime js,string result){
			var twit=$"https://twitter.com/intent/tweet?text={HttpUtility.UrlEncode(result)}";
			await js.InvokeVoidAsync("window.open",new[]{twit,"twit",$@"
				width=600,
				height=300,
				menubar=0,
				location=1,
				directories=0,
				status=0,
				scrollbars=1,
				toolbar=0,
				resizable=1
			"});
		}
	}
}
