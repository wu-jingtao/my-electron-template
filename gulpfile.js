const path = require('path');
const fs = require('fs-extra');
const package_json = require('./package.json');

const gulp = require("gulp");
const ts = require("gulp-typescript").createProject('tsconfig.json');
const less = require('gulp-less');
const lessAutoPrefix = new (require('less-plugin-autoprefix'))({ browsers: ['last 2 versions'] });
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const packager = require('electron-packager');


gulp.task("watch", function () {
    gulp.watch(['src/**/*.ts', 'src/**/*.tsx'], ['compile_ts']);
    gulp.watch(['src/**/*.less'], ['compile_less']);
});

//编译TS代码
gulp.task("compile_ts", function () {
    return gulp.src(['src/**/*.ts', 'src/**/*.tsx'])
        .pipe(sourcemaps.init())
        .pipe(ts())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('bin'));
});

//编译Less
gulp.task("compile_less", function () {
    return gulp.src(['src/**/*.less'])
        .pipe(sourcemaps.init())
        .pipe(concat('index.less'))
        .pipe(less({ plugins: [lessAutoPrefix] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('bin'));
});

//打包程序
gulp.task('package_electron', ['compile_ts', 'compile_less'], function (done) {

    //删除上次打包的，避免发生错误
    fs.removeSync(path.resolve(__dirname, `./release/${package_json.version}`));

    const options = {
        dir: __dirname,
        out: path.resolve(__dirname, `./release/${package_json.version}`),
        appCopyright: package_json.license,
        platform: 'win32',
        arch: 'x64',
        asar: true,
        icon: package_json.icon && path.resolve(__dirname, package_json.icon),
        ignore: /[/\\]\.vscode|electron_build|release|src[/\\]/,    //打包时忽略 .vscode electron_build release src 目录
        download: {
            cache: path.resolve(__dirname, './electron_build'),
            mirror: 'https://npm.taobao.org/mirrors/electron/'
        }
    };

    packager(options, function done_callback(err, appPaths) {
        console.log(err, appPaths);
        err ? done(err) : done();
    });
});