/**
 * ライブラリインポート
 */
const gulp = require("gulp");
const sass = require("gulp-sass");
const browser = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const fractal = require('@frctl/fractal').create();
const sourcemaps = require("gulp-sourcemaps");
const logger = fractal.cli.console;    // keep a reference to the fractal CLI console utility

/**
 * 定数
 */
const port_fractal = 3000;                                            // フラクタルサーバポート
const port_server = 4000;                                             // アプリサーバポート
const port_ui = 5000;                                                 // アプリUIポート
const dir_assets = __dirname + "/styleguide/assets"                   // 静的ファイルディレクトリ
const dir_build = __dirname + "/styleguide/build";                    // 静的UI書出先ディレクトリ
const dir_docs = __dirname + "/styleguide/docs";                      // docsディレクトリ
const dir_components = __dirname + "/styleguide/components";          // componentsディレクトリ
const dir_app = __dirname + "/web";                                   // アプリディレクトリ
const dir_sass = dir_app + "/sass/**/*.scss";                         // sassのコンパイルディレクトリ
const project_title = "おみくじアプリのスタイルガイド";                    // アプリタイトル
/**
 * gulpタスク
 */
const task_fractal_start = "fractal:start";                           // flactalサーバを起動する
const task_fractal_build = "fractal:build";                           // fractalのビルドを行う
const task_sass = "sass";                                             // sassのビルドを行う
const task_watch = "watch";                                           // ディレクトリを監視し変更契機にビルドを行う
const task_server = "server";                                         // おみくじアプリサーバを起動する
const task_reload = "reload";                                         // ブラウザをリロードする
const task_default = "default";                                       // default

/**
 * defaultタスクで実行するタスク
 */
const start_task = [
  task_fractal_start,
  task_sass,
  task_fractal_build,
  task_watch,
  task_server
];

/**
 * フラクタル設定
 */
fractal.web.set('builder.dest', dir_build);                           // 静的UI書出先ディレクトリ
fractal.set('project.title', project_title);                          // プロジェクトタイトル
fractal.web.set('static.path', dir_assets);                           // 静的ファイルディレクトリ
fractal.docs.set('path', dir_docs);                                   // docsディレクトリ
fractal.components.set('path', dir_components);                       // componentディレクトリ
// fractal.web.set('server.port',8080);                               //fractalサーバのポート設定
// fractal.web.set('server.syncOptions',{
//   open:true,
//   browser:['chrome'],                                              //ブラウザを何で開くか指定
//   notify:true,                                                     //開けなかったときの通知を出すか指定
//   ui:{port:11111}                                                  //ポート指定
// });


/**
 * 実行タスク
 */

/*
 * Start the Fractal server
 *
 * In this example we are passing the option 'sync: true' which means that it will
 * use BrowserSync to watch for changes to the filesystem and refresh the browser automatically.
 * Obviously this is completely optional!
 *
 * This task will also log any errors to the console.
 */
gulp.task(task_fractal_start, function(db){
    const server = fractal.web.server({
        sync: true,
        port:port_fractal                               //fractalサーバのポート設定
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
gulp.task(task_fractal_build, function(db){
    const builder = fractal.web.builder();
    builder.on('progress', (completed, total) => {
      logger.update(`Exported ${completed} of ${total} items`, 'info')
    });
    builder.on('error', err => logger.error(err.message));    
    db();
    return builder.start().then(() => {
      logger.success('Fractal build completed!');
    });
    // return builder.build().then(() => {
    //     logger.success('Fractal build completed!');
    // });
});

/**
 * serverタスク
 * defaultタスクから呼び出されるタスク
 */
gulp.task(task_server, function(db) {
  browser({
    server: {baseDir: dir_app},          // アプリサーバの先頭アクセス時ディレクトリ設定
    port:port_server,                     // アプリサーバのポート設定
    ui: {port:port_ui}                    //UIポート設定
  });
  db();
});

/**
 * sassタスク
 * defaultタスクから呼び出されるタスク
 * 
 */
gulp.task(task_sass,function(db){
  /* sassのコンパイル(./web/sass → ./web/css) */
  gulp.src(dir_sass)                        // gulp.src()...読み込むファイルの設定
    .pipe(sourcemaps.init())                // sourcemapファイルを初期化
    .pipe(plumber())                        // plumber()...エラーが起きたとしても強制終了させない
    .pipe(sass({outputStyle:'expanded'}))   // sassからcssを圧縮して出力する
                                            // pipe()...srcで取得したファイルに行う処理を記載
                                            // sass()...コンパイルの実行をする。outputStyleで吐き出すcssのスタイルを設定
    .pipe(autoprefixer({                    // autoprefixer()...ベンダープレフィックスの付与
      cascade:false
    }))
    .pipe(sourcemaps.write('.'))            // sourcemapファイルを出力する
    .pipe(gulp.dest(dir_app + "/css"))      // gulp.dest()...出力したい場所を記載
    .pipe(gulp.dest(dir_assets + "/css"));  // 変換したファイルをコピー(./web/css/** → ./assets/css)

  /* ディレクトリごとコピー(./web/css/** → ./assets/css) */
  // gulp.src(__dirname + "/web/css/**")
  //   .pipe(gulp.dest(dir_assets + "/css"));

  /* ディレクトリごとコピー()./web/sass/** → ./assets/sass) */
  gulp.src(__dirname + "/web/sass/**")
    .pipe(gulp.dest(dir_assets + "/sass"));

    /* ディレクトリごとコピー()./web/js/** → ./assets/js) */
  gulp.src(__dirname + "/web/js/**")
    .pipe(gulp.dest(dir_assets + "/js"));

  // const items = ["button","layout","form","table","common","card","style"];
  // items.forEach(function (item){
  //   gulp.src('./web/css/' + item + '.css')
  //   .pipe(gulp.dest(dir_assets + "/css"))
  //   .pipe(gulp.dest(dir_components + "/" + item));
  // });
  db();
});

/**
 * reloadタスク
 * watchタスクから呼び出されるタスク
 * ブラウザをリロードする
 */
gulp.task(task_reload,function(db){
  browser.reload();
  db();
})

/**
 * watchタスク
 * defaultタスクから呼び出されるタスク
 * scssファイルに更新があったらsassタスク、reloadタスクを実行する
 * htmlファイルに更新があったらreloadタスクを実行する
 */
gulp.task(task_watch,function(db){
  // gulp.watch(監視するファイルパス,gulp.parallel([実行タスク名]));・・・並列実行
  gulp.watch(["./web/sass/**/*.scss","./web/js/**/*.js"],gulp.parallel([task_sass,task_reload]));//※並列実行の根拠なし直列で動くと思う
  // gulp.watch(監視するファイルパス,gulp.series([実行タスク名]));・・・直列実行
  gulp.watch(["./**/*.html","./**/*.hbs"],gulp.series([task_reload]));
  db();
});

/**
 * defaultタスク
 * `gulp`コマンドで動作させるタスク
 * 本来gulpのcli実行コマンドは、gulp.task(タスク名,処理)"gulp タスク名"というように実行する必要があるが、
 * タスク名をdefaultにするとコマンドにタスク名を入れる必要がなくなる。
 */
gulp.task(task_default,gulp.series(start_task));
// gulp.task('default',gulp.series(gulp.parallel(['sass','watch','server'])));
// gulp.task('default',gulp.series(gulp.parallel(['fractal:start','sass','fractal:build','watch','server'])));
