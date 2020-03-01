//雑務クラス
export default class Util{
	//空白埋め
	public static padStr(str:string,strLen:number,maxLen:number):string{
		var target=maxLen-strLen;
		str+="　".repeat(0|target/2);
		if(target%2!=0) str+=" ";
		return str;
	}

	//文字幅取得
	public static lenB(str:string):number{
		var len=0;
		for(let chr of str){
			let cc=chr.charCodeAt(0);
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
	public static async setClipBoard(value:string,ele:HTMLInputElement){
		try{
			await navigator.clipboard.writeText(value);
		}
		catch{
			await new Promise(res=>setTimeout(res,1));
			if(navigator.userAgent.match(/ipad|ipod|iphone/i)){
				//@ts-ignore
				window.getSelection().addRange(
					//@ts-ignore
					window.document.createRange().selectNode(ele));
			}
			else{
				ele.select();
			}
			document.execCommand("copy");
			//@ts-ignore
			window.getSelection().removeAllRanges();
		}
	}

	//twitter用呟きウィンドウを表示
	public static tweet(result:string){
		var twit=`https://twitter.com/intent/tweet?text=${encodeURI(result)}`;
		window.open(twit,"twit",`
			width=600,
			height=300,
			menubar=0,
			location=1,
			directories=0,
			status=0,
			scrollbars=1,
			toolbar=0,
			resizable=1
		`);
	}
}
