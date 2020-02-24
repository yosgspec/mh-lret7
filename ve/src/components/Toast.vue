<template>
<div id=toast :class="{toastShow: isShow, toastHide: !isShow}">
	{{msg}}
</div>
</template>

<style scoped>
#toast{
	position: fixed;
	z-index: 100;
	left: 50%;
	transform: translateX(-50%); 

	font-weight: bold;
	font-size: 1.4em;
	transition: all 500ms;
	background-color: #992200;
	color: #FF6644;
	border-radius: 5px;
	padding: 5px;
	top: 5px;
}
.toastShow{opacity: 0.8;}
.toastHide{opacity: 0.0;}
</style>

<script lang=ts>
import {Component,Vue,Prop} from "vue-property-decorator";

@Component
export default class Toast extends Vue{
	private isShow=false;
	private msg="";

	public async show(msg:string){
		this.msg=msg;
		this.isShow=true;
		await new Promise(res=>setTimeout(res,2500));
		this.isShow=false;
	}
}
</script>
