# README.md
本プロジェクトはomikujiアプリケーションになります。
タスクランナーgulpにより以下のタスクを自動化しています。
- sassの自動コンパイル
- autoprefixerによるベンダープレフィックスの自動化
- serverの起動
- serverの自動リロード
- fractal

## require
[node.js](https://nodejs.org/ja/)
[gulp.js](https://gulpjs.com/)

## 実行方法
```
npm install
gulp
```
## 環境構築
以下コマンドでpackage.jsonを作成
```
npm init
npm install gulp --save-dev
npm install gulp-sass --save-dev
npm install browser-sync --save-dev
npm install gulp-plumber --save-dev
npm install --save-dev gulp-autoprefixer
npm install @frctl/fractal --save-dev
npm install gulp-sourcemaps --save-dev
```
## scssのビルドについて
- ビルド元のscss
   - `web/sass`
- scssビルド時の出力先
   - `web/css`
- scssを出力後はstyleguideの静的ディレクトリにコピーされる
  - `web/css`と`web/sass`を`/styleguide/assets`にコピー 

## ディレクトリの説明
- node_modules
  - `npm install`で取得したパッケージ
- styleguide
  - スタイルガイド(fractal)
- styleguide/assets
  - 静的ディレクトリ
    `web/css`、`web/sass`からコピーされて生成される  
    静的ディレクトリはgulpfile.jsで指定
  - styleguideはこのディレクトリをルートパスとして`{{ path '/css/style.css' }}`のように指定可能
- styleguide/build
  - スタイルガイドの静的WebUIディレクトリ　　
    gulp処理中の`fractal:build`にて本ディレクトリが生成される
- styleguide/components
  - スタイルガイドの生成元の構成ディレクトリ
  - `_preview.hbs`がテンプレートファイル
- styleguide/docs
  - スタイルガイドのドキュメントディレクトリ
  - ドキュメントをマークダウンで残す
- web
  - おみくじアプリ
- web/sass
  - ビルド元のscss
- web/css
  - web/sassから生成される
- gulpfile.js
  - gulp設定ファイル
    `gulp`コマンド実行時に動作させる処理を記載する
- package.json
  - npmで導入するパッケージの設定
  ```json
  {
    "name": "omikuji",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test  specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "@frctl/fractal": "^1.5.1",
      "browser-sync": "^2.26.7",
      "gulp": "^4.0.2",
      "gulp-autoprefixer": "^7.0.1",
      "gulp-plumber": "^1.2.1",
      "gulp-sass": "^4.1.0"
    },
    //★ここにautoprefixerの設定を追加
    "browserslist": [
      "last 2 version",
      "> 5%",
      "ie >= 9"
    ]
  }
  ```
## 備忘録
以下のサイトを参考に本プロジェクトを作成。
- [参考サイト1](https://qiita.com/nabe_kurage/items/b3f154a09962f692df14)
- [参考サイト2](https://www.npmjs.com/package/gulp-autoprefixer)
- [参考サイト3](https://webdesign-trends.net/entry/10069)
- [参考サイト4](https://3owebcreate.com/web/coding/webpack_autoprefixer_setting)
- [参考サイト5](https://satoyan419.com/gulp-v4/)
- [参考サイト6](https://codecodeweb.com/blog/459/)
- [参考サイト7](https://www.tweeeety.blog/entry/2018/06/18/060030)
