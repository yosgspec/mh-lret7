<template>
<div class=readme>
	<div class=page-title>ルーレットについて</div>
	<hr>
	<div class=flex-center-col>
		<div style=max-width:650px>
			<b>【ルーレット概要】</b><br>
			本サイトのルーレットはモンスターハンターシリーズ、ゴッドイーターシリーズ、討鬼伝シリーズに関する武器やクエストなどの様々な条件をランダムで決定するというものです。
			<p style=margin:16px></p>
			<b>【各項目について】</b><br>
			<b>・プレイヤー名</b><br>
			ルーレットに参加するプレイヤー名を入力します。<br>
			ルーレットは入力した人数分で行われます。<br>
			装備系のルーレットを行わない場合は入力しなくても問題ありません。
			<p style=margin:16px></p>
			<b>・ルーレット内容</b><br>
			ルーレットを行う内容を選択します。<br>
			なお、装備系はプレイヤー名が未入力だと選択していてもルーレットされません。<br>
			また、ギルドクエスト及び縛りはeditをクリックすると編集することができます。
			<p style=margin:16px></p>
			<b>・設定/オプション</b><br>
			ここで様々な設定を行えます。<br>
			<p style="padding-left:1em;margin:0;">
			<b>*○○重複させない</b><br>
			○○の部分の物を複数人被らせないように出力します。<br>
			<b>*○○を統一</b><br>
			参加者全員が○○の部分の物を同一の物に設定します。<br>
			<b>*クリップボードに出力</b><br>
			結果をクリップボードに出力します。<br>
			⇒もし、チャットなどを通じて貼り付けで共有を行えない場合は<a href="http://jbbs.shitaraba.net/netgame/13276/" title="こちら" target=_blank>こちら</a>で共有を行えます。<br>
			<b>*twitterに投稿</b><br>
			結果が出力されると同時にウインドウが開かれ、結果をtwitterの入力欄に書き込みます。<br>
			twitterへの書き込みでは縛りは適用されないのでご了承ください。<br>
			⇒もし、必要ならば縛りのみ<a href="http://gspectool.ifdef.jp/lret/dm/" title="こちら" target=_blank>こちら</a>から個別でtwitter投稿が可能です。
			</p>
			<p style=margin:16px></p>
			<b>・クエスト/ミッション/任務範囲</b><br>
			出力するクエスト/ミッション/任務の選択範囲を設定します。<br>
			<p style=margin:9px></p>
			<b>【お問い合わせ】</b><br>
			ブログ：<a href="http://yosgspec.blog103.fc2.com/" target=_blank>YOS G-specの適当なブログ</a><br>
			ツイッター：<a href="http://twitter.com/yosgspec" target=_blank>@yosgspec</a><br>
			<a href="http://form1.fc2.com/form/?id=501824" target=_blank class=readmeMail>
				<img alt="メール" title="メール" src="@/assets/mailAddress.gif">
				<img alt="メール" title="メール" src="@/assets/mailAddressHover.gif" class=hover>
			</a>
			<p style=margin:9px></p>
		</div>
	</div>
</div>
</template>

<style scoped>
.readmeMail{
	position: relative;
}
.readmeMail .hover{
	position: absolute;
	left: 0;
	top: 10px;
	opacity: 0;
}
.readmeMail:hover .hover{
	opacity: 1;
}
</style>

<script lang=ts>
import {Component,Vue} from "vue-property-decorator";

@Component
export default class Readme extends Vue{}
</script>
