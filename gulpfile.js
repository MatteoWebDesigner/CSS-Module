'use strict';

var fs              = require('fs');
var path            = require('path');
var _               = require('lodash');
var del             = require('del');
var parseArgs       = require('minimist');
var gulp            = require('gulp');
var gutil           = require('gulp-util');
var gulpif          = require('gulp-if');
var clean           = require('gulp-clean');
var chug            = require('gulp-chug');
var gulpPreprocess  = require('gulp-preprocess');
var check           = require('gulp-check');
var runSequence     = require('run-sequence');
var connect         = require('gulp-connect');
var open            = require('gulp-open');
var livereload      = require('gulp-livereload');
var sourcemaps      = require('gulp-sourcemaps');
var gulpData        = require('gulp-data');
var htmlmin         = require('gulp-htmlmin');
var jade            = require('gulp-jade');
var postcss         = require('gulp-postcss');
var cssModules      = require('postcss-modules');
var concat          = require('gulp-concat');
var browserify      = require('browserify');
var riot            = require('riot');
var riotify         = require('riotify');
var source          = require('vinyl-source-stream');
var jshint          = require('gulp-jshint');
var uglify          = require('gulp-uglify');
var config          = require('./config.js');


function isSourceMap ()
{
    return parseArgs(process.argv).sm;
};


gulp.task('clean', function ()
{
    return gulp.src(config.clean)
		.pipe(clean({force: true}))
});


gulp.task('fonts', function ()
{
    return gulp
        .src(config.fontFiles)
        .pipe(gulp.dest(config.fontDist));
});


gulp.task('html', function()
{
    return gulp
        .src(config.htmlFiles)
        //.pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.htmlDist))
        .pipe(livereload());
});


gulp.task('jade', function()
{
    var json = require('./css-module.json')

    return gulp.src(config.jadePageFiles)
        .pipe(gulpData(function(file) {
            return { className: json };
        }))
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(config.htmlDist))
        .pipe(livereload());
});


gulp.task('cssVendor', function()
{
    if (config.vendor.css.length == 0) {
        console.log('vendor css empty');
        return false;
    }

    return gulp
        .src(config.vendor.css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.cssDist));
});


gulp.task('css', function() {

    return gulp
        .src('./src/css/main.css')
        .pipe(postcss([
            cssModules({
                getJSON: function(cssFileName, json) {
                    var path          = require('path');
                    var cssName       = path.resolve('./dist/main.css');
                    var jsonFileName  = path.resolve('./css-module.json');

                    console.log(cssFileName, json, cssName);

                    fs.writeFileSync(jsonFileName, JSON.stringify(json));
                }
            }),
            cssModules({
                generateScopedName: function(name, filename, css) {
                    var path      = require('path');
                    var i         = css.indexOf('.' + name);
                    var numLines  = css.substr(0, i).split(/[\r\n]/).length;
                    var file      = path.basename(filename, '.css');

                    return '_' + file + '_' + numLines + '_' + name;
                }
            })
        ]))
        .pipe(gulp.dest('./build'));
});


gulp.task('jsVendor', function()
{
    if (config.vendor.js.length == 0) {
        console.log('vendor js empty');
        return false;
    }

    return gulp
        .src(config.vendor.js)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDist));
});


gulp.task('js', function()
{
    return browserify({ entries: [config.jsMain] })
        .transform(riotify) // pass options if you need
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(config.jsDist))
        .pipe(livereload());
    // .pipe(
    //     gulpif(isSourceMap(), sourcemaps.init())
    // )
    // //.pipe(uglify())
    // .pipe(
    //     gulpif(isSourceMap(),sourcemaps.write())
    // )
});


gulp.task('watch', function()
{
    livereload.listen();

    gulp.watch(config.htmlFiles,['html']);
    gulp.watch(config.jadeFiles,['jade']);
    gulp.watch(config.sassFiles,['css']);
    gulp.watch([config.jsFiles,config.tagFiles],['js']);
});


gulp.task('connect', function()
{
    connect.server({
        root: ['dist'],
        port: config.port,
        livereload: true
    });

    // open default browser
    gulp
    .src(__filename)
    .pipe(
        open({uri: config.localhost})
    );
});


// gulp --sm you activate sourcemap task
gulp.task('default', function ()
{
    runSequence(
        'clean',
        ['cssVendor','css'],
        ['fonts','html','jade','jsVendor','js'],
        'connect','watch'
    );
});