'use strict';

var mkdirp          = require('mkdirp');
var fs              = require('fs');
var path            = require('path');
var argv            = require('yargs').argv;
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
var autoprefixer    = require('autoprefixer');
var cssnano         = require('gulp-cssnano');
var sass            = require('gulp-sass');
var concat          = require('gulp-concat');
var browserify      = require('browserify');
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
    return gulp.src(config.jadePageFiles)
        .pipe(gulpData(function(file) {
            var CSSModule = {};

            // loop bundle
            _.forEach(config.cssBundle, function(modulesObj, bundleName) {

                // loop modules
                _.forEach(modulesObj, function (obj) {
                    var shortModuleName = obj.moduleName.charAt(0);
                    var json  = path.resolve('./css-modules/' + bundleName +'/'+ shortModuleName +'/'+ obj.fileName + '.json');
                    var classNames      = fs.readFileSync(json).toString();

                    if (CSSModule[bundleName] === undefined) { CSSModule[bundleName] = {}; }
                    if (CSSModule[bundleName][shortModuleName] === undefined) { CSSModule[bundleName][shortModuleName] = {}; }

                    CSSModule[bundleName][shortModuleName]   = JSON.parse( classNames );
                });
            });

            return {
                "css" : CSSModule
            };
        }))
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(config.htmlDist))
        .pipe(livereload());
});


gulp.task('css', function() {
    var bundle,
        bundleName = argv.bundle,
        bundleCss = [];

    if (config.cssBundle[bundleName] === undefined) {
        console.log('this bundle name does not exist');
        process.exit(1);
    }

    // build path css
    _.forEach(config.cssBundle[bundleName], function(obj) {
        var cssPath = 'src/css/' + bundleName + '/' + obj.moduleName + '/'+ obj.fileName + '.css';
        bundleCss.push(cssPath);
    });

    return gulp
        .src(bundleCss)
        .pipe(postcss([
            cssModules({
                generateScopedName: function(name, filepath, css) {
                    var i             = css.indexOf('.' + name);
                    var numLines      = css.substr(0, i).split(/[\r\n]/).length;
                    var pathParts     = path.dirname(filepath).split('/');
                    var pathPartsLng  = pathParts.length;
                    var bundleName    = pathParts.slice(pathPartsLng - 2, pathPartsLng - 1 )[0];
                    var moduleName    = pathParts.slice(pathPartsLng - 1 , pathPartsLng )[0].charAt(0);
                    var fileName      = path.basename(filepath, '.css');

                    // console.log('_' + name + '_' + bundleName + '_' + moduleName + '_' + fileName + numLines);

                    return '_' + name + '_' + bundleName + moduleName + fileName + numLines;
                },
                getJSON: function(filepath, json) {
                    var pathParts     = path.dirname(filepath).split('/');
                    var pathPartsLng  = pathParts.length;
                    var bundleName    = pathParts.slice(pathPartsLng - 2, pathPartsLng - 1 )[0];
                    var moduleName    = pathParts.slice(pathPartsLng - 1 , pathPartsLng )[0].charAt(0);
                    var fileName      = path.basename(filepath, '.css');
                    var jsonLocation  = './css-modules/' + bundleName + '/' + moduleName + '/';

                    // create folder if does not exist
                    mkdirp(jsonLocation, function (err) {
                        if (err) { console.error(err); }
                        else {
                            // console.log('folder created');

                            var jsonFileName  = path.resolve(jsonLocation + fileName + '.json');

                            // console.log(jsonFileName);

                            fs.writeFileSync(jsonFileName, JSON.stringify(json));
                        }
                    });
                }
            }),
            autoprefixer({ browsers: ['last 2 versions'] })
        ]))
        .pipe(concat('main-'+ bundleName +'.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css'));
});


gulp.task('build-bootstrap', function() {

    return gulp
        .src('./resources/bootstrap-sass/**/*.scss') // /src/css/bundle/module/name.css
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./resources/bootstrap-css/'));
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
    gulp.watch(config.cssFiles,['jade','css']);
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
        ['css'],
        ['fonts','html','jade','jsVendor','js'],
        'connect','watch'
    );
});