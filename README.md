# MHルーレット
モンスターハンターシリーズ用のルーレット(Webアプリ)のソースです。

## プラットフォーム
html(そこそこモダンなブラウザ)  

## フレームワーク・Webフォント
[Vue.js/TypeScript](https://jp.vuejs.org/)  
[Blazor WebAssembly](https://docs.microsoft.com/ja-jp/aspnet/core/blazor/?view=aspnetcore-3.1)  
[M+フォント](https://mplus-fonts.osdn.jp/about.html)  

## 動作ページ
[Vue.js版](http://yosgspec.starfree.jp/lret/mhwi-ve/)  
[Blazor版](http://yosgspec.starfree.jp/lret/mhwi-br/)  

## 動作・ビルド
### Vue.js(./ve/)
要[Node.js](https://nodejs.org/ja/)・[yarn](https://yarnpkg.com/lang/ja/)  

```bash:実行コマンド
# ディレクトリの移動
~$ cd ve

# 必要なモジュールをインストール
~/ve$ yarn install

# ローカルサーバーを起動
# http://localhost:8080/ で開く
~/ve$ yarn serve

# ビルド
# /ve/dist/ にファイルが書き出される
~/ve$ yarn build
```

### Blazor(./br/)
要[Net Core 3.1](https://dotnet.microsoft.com/download)

```bash:実行コマンド
# ディレクトリの移動
~$ cd br

# ローカルサーバーを起動
# http://localhost:5000 で開く
~/br$ dotnet watch run

# ビルド
# /br/out/mh-lret/dist/ にファイルが書き出される
~/br$ dotnet publish -c Release -o dist
```