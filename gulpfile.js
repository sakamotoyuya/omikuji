var gulp = require("gulp");
var sass = require("gulp-sass");
var browser = require("browser-sync");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require("gulp-plumber");
const fractal = require('@frctl/fractal').create();

fractal.set('project.title', 'おみくじアプリのスタイルガイド'); // title for the project
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

gulp.task('fractal:start', function(db){
    const server = fractal.web.server({
        sync: true
    });
    server.on('error', err => logger.error(err.message));
    return server.start().then(() => {
        logger.success(`Fractal server is now running at ${server.url}`);
    });
    db();

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

gulp.task('fractal:build', function(db){
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
    builder.on('error', err => logger.error(err.message));
    return builder.build().then(() => {
        logger.success('Fractal build completed!');
    });
    db();

});

gulp.task("server", function(db) {
  browser({
    server: {
      baseDir: "./web/"//ドキュメントディレクトリを指定する。
    }
  });
  db();
});

const publicfolder = "./styleguide/public/css/";
const componentsfolder = "./styleguide/components/";

gulp.task("sass",function(db){//タスクの登録（"sass"タスク登録)
  gulp.src("./web/sass/**/*.scss")//gulp.src()...読み込むファイルの設定
  .pipe(plumber())//plumber()...エラーが起きたとしても強制終了させない
  .pipe(sass({outputStyle:'expanded'}))
  //pipe()...srcで取得したファイルに行う処理を記載
  //sass()...コンパイルの実行をする。outputStyleで吐き出すcssのスタイルを設定
  .pipe(autoprefixer({//autoprefixer()...ベンダープレフィックスの付与
    cascade:false
  }))
  .pipe(gulp.dest("./web/css/"))//gulp.dest()...出力したい場所を記載
  .pipe(gulp.dest(publicfolder));//gulp.dest()...出力したい場所を記載
 
  //./css/button.cssを別のフォルダに書き出す
  const items = ["button","layout","form","table","common","card"];
  // const items = ["button"];
  items.forEach(function (item){
    gulp.src('./web/css/' + item + '.css')
    .pipe(gulp.dest(publicfolder))
    .pipe(gulp.dest(componentsfolder + item));
  });
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
  gulp.watch("./web/sass/**/*.scss",gulp.parallel(["sass","reload"]));
  //htmlファイルに更新があったらreloadタスクを実行する
  gulp.watch(["./**/*.html","./**/*.hbs"],gulp.series(["reload"]));
  db();
});

//sassタスクwatchタスク、serverタスクを実行する。
// gulp.task('default',gulp.series(gulp.parallel(['sass','watch','server'])));
gulp.task('default',gulp.series(gulp.parallel(['fractal:start','sass','fractal:build','watch','server'])));
