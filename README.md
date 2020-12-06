# README.md
本プロジェクトはomikujiアプリケーションになります。
タスクランナーgulpにより以下のタスクを自動化しています。
- sassの自動コンパイル
- autoprefixerによるベンダープレフィックスの自動化
- serverの起動
- serverの自動リロード
- fractal

## require
node.js
gulp

## 実行方法
```
npm install
gulp
```
## 備忘録
以下のサイトを参考に本プロジェクトを作成。
- [参考サイト１](https://qiita.com/nabe_kurage/items/b3f154a09962f692df14)
- [参考サイト2](https://www.npmjs.com/package/gulp-autoprefixer)
- [参考サイト3](https://webdesign-trends.net/entry/10069)
- [参考サイト4](https://3owebcreate.com/web/coding/webpack_autoprefixer_setting)
- [参考サイト5](https://satoyan419.com/gulp-v4/)
- [参考サイト6](https://codecodeweb.com/blog/459/)
- [参考サイト7](https://www.tweeeety.blog/entry/2018/06/18/060030)

必要なプラグインのインストール
コマンドライン
```
npm init
npm install gulp --save-dev
npm install gulp-sass --save-dev
npm install browser-sync --save-dev
npm install gulp-plumber --save-dev
npm install --save-dev gulp-autoprefixer
npm install @frctl/fractal --save-dev

```

- glupfile.js
```js
var gulp = require("gulp");
var sass = require("gulp-sass");
var browser = require("browser-sync");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require("gulp-plumber");
const fractal = require('@frctl/fractal').create();

fractal.set('project.title', 'FooCorp Component Library'); // title for the project
fractal.web.set('builder.dest', `${__dirname}/styleguide/build`); // destination for the static export
fractal.docs.set('path', `${__dirname}/styleguide/docs`); // location of the documentation directory.
fractal.components.set('path', `${__dirname}/styleguide/components`); // location of the component directory.
/*
 * Tell the Fractal web preview plugin where to look for static assets.
 * webの場所を設定
 */
fractal.web.set('static.path', __dirname + '/styleguide/public');

// any other configuration or customisation here

const logger = fractal.cli.console; // keep a reference to the fractal CLI console utility

/*
 * Start the Fractal server
 *
 * In this example we are passing the option 'sync: true' which means that it will
 * use BrowserSync to watch for changes to the filesystem and refresh the browser automatically.
 * Obviously this is completely optional!
 *
 * This task will also log any errors to the console.
 */

gulp.task('fractal:start', function(){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
});

/*
 * Run a static export of the project web UI.
 *
 * This task will report on progress using the 'progress' event emitted by the
 * builder instance, and log any errors to the terminal.
 *
 * The build destination will be the directory specified in the 'builder.dest'
 * configuration option set above.
 */

gulp.task('fractal:build', function(){
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
        logger.success('Fractal build completed!');
    });
});

gulp.task("server", function(db) {
  browser({
    server: {
      baseDir: "./"//ドキュメントディレクトリを指定する。
    }
  });
  db();
});

gulp.task("sass",function(db){//タスクの登録（"sass"タスク登録)
  gulp.src("sass/**/*.scss")//gulp.src()...読み込むファイルの設定
  .pipe(plumber())//plumber()...エラーが起きたとしても強制終了させない
  .pipe(sass({outputStyle:'expanded'}))
  //pipe()...srcで取得したファイルに行う処理を記載
  //sass()...コンパイルの実行をする。outputStyleで吐き出すcssのスタイルを設定
  .pipe(autoprefixer({//autoprefixer()...ベンダープレフィックスの付与
    cascade:false
  }))
  .pipe(gulp.dest("./css"))//gulp.dest()...出力したい場所を記載
  // .pipe(gulp.dest("./styleguide/public/css"))//gulp.dest()...出力したい場所を記載
  // .pipe(gulp.dest("./styleguide/components/example"));

  gulp.src('./css/button.css')//ルートフォルダのbutton.cssを
      .pipe(gulp.dest('./styleguide/public/css/'))//styleguide/public/cssにコピーする
      .pipe(gulp.dest('./styleguide/components/button/'));//styleguide/components/buttonにコピーする
  db();
});

gulp.task("reload",function(db){
  browser.reload();//ブラウザーのリロード
  db();
})

gulp.task("watch",function(db){
  //watch(['監視するファイル'],['実行したいタスク名'])
  //タスク名をdefaultにするとコマンドにタスク名を入れる必要がなくなる。

  //scssファイルに更新があったらsassタスク、reloadタスクを実行する
  gulp.watch("sass/**/*.scss",gulp.parallel(["sass","reload"]));
  //htmlファイルに更新があったらreloadタスクを実行する
  gulp.watch("./**/*.html",gulp.series(["reload"]));
  db();
});

//sassタスクwatchタスク、serverタスクを実行する。
// gulp.task('default',gulp.series(gulp.parallel(['sass','watch','server'])));
gulp.task('default',gulp.series(gulp.parallel(['fractal:start','fractal:build','sass','watch','server'])));

```
package.jsonの修正
```json
{
  "name": "omikuji",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
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
