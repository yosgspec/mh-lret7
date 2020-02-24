//XorShiftライブラリ

export class XorShift{
	private r:Iterator<number>;
	public static defaults:{[s:string]:number}={
		x:123456789,
		y:362436069,
		z:521288629,
		w:88675123
	};
	public readonly seeds:{[s:string]:number};
	public randCount=0;

	constructor(_w?:number,_x?:number,_y?:number,_z?:number){
		var w=_w || 0|Date.now() as number;
		var x=_x || 0|w<<13 as number;
		var y=_y || 0|(w>>>9)^(x<<6) as number;
		var z=_z || 0|y>>>7 as number;
		this.seeds={x:x>>>0,y:y>>>0,z:z>>>0,w:w>>>0};
		this.randCount=0;
		this.r=this.randGen(w,x,y,z);
	}

	public *randGen(w:number,x:number,y:number,z:number):Iterator<number>{
		var t:number;
		for(;;){
			t=x^(x<<11);
			x=y;
			y=z;
			z=w;
			yield w=((w^(w>>>19))^(t^(t>>>8)))>>>0;
		}
	}

	public rand():number{
		this.randCount=0|this.randCount+1;
		return this.r.next().value;
	}

	public randInt(min:number=0,max:number=0x7FFFFFFF):number{
		return 0|this.rand()%(max+1-min)+min;
	}

	public randFloat(min:number=0,max:number=1):number{
		return Math.fround(this.rand()%0xFFFF/0xFFFF)*(max-min)+min;
	}

	public shuffle<T>(_arr:T[]):T[]{
		var arr=Array.from(_arr);
		for(let i=0;i<=arr.length-2;i=0|i+1){
			let r=this.randInt(i,arr.length-1);
			let tmp=arr[i];
			arr[i]=arr[r];
			arr[r]=tmp;
		}
		return arr;
	}

	public defaultSeed=class extends XorShift{
		constructor(){
			super(
				XorShift.defaults["w"],
				XorShift.defaults["x"],
				XorShift.defaults["y"],
				XorShift.defaults["z"]
			);
		}
	}
}
