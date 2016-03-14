'use strict';

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
var htmlmin         = require('gulp-htmlmin');
var jade            = require('gulp-jade');
var sass            = require('gulp-sass');
var postcss         = require('gulp-postcss');
var autoprefixer    = require('gulp-autoprefixer');
var cssnano         = require('gulp-cssnano');
var combineMq       = require('gulp-combine-mq');
var csslint         = require('gulp-csslint');
var stylelint       = require('gulp-stylelint').default;
var stylelintLog    = require('gulp-stylelint-console-reporter').default;
var doiuse          = require('doiuse');
var symdiff         = require('gulp-symdiff');
var symdiffHtml     = require('symdiff-html');
var symdiffCss      = require('symdiff-css');
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
    return gulp.src(config.jadePageFiles)
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
        .pipe(cssnano())
        .pipe(gulp.dest(config.cssDist));
});


gulp.task('css', function()
{
    return gulp
        .src(config.sassIndex)
        .pipe(
            gulpif(isSourceMap(), sourcemaps.init())
        )
        .pipe(sass().on('error', sass.logError))
        .pipe( // fontello anticache
            gulpPreprocess(config.preprocess)
        )
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(combineMq({beautify: false}))
        .pipe(cssnano())
        .pipe(
            gulpif(isSourceMap(),sourcemaps.write())
        )
        .pipe(gulp.dest(config.cssDist))
        .pipe(livereload());
});


gulp.task('css-support', function() {
    return gulp.src(config.sassIndex)
        .pipe(sass().on('error', sass.logError))
        .pipe( // fontello anticache
            gulpPreprocess(config.preprocess)
        )
        .pipe(gulp.dest(config.cssTemp))
        .pipe(
            postcss([
                doiuse({
                    browsers: ['ie >= 10', '> 1%', 'last 2 versions'],
                    onFeatureUsage: function(usageInfo) {
                        console.log(usageInfo.message)
                    }
                })
            ])
        );
});


// I cannot add css-lint because output error
gulp.task('css-lint', function ()
{
    gulp.src(config.cssDistFiles)
    .pipe(csslint(config.csslint))
    .pipe(csslint.reporter());
});


gulp.task('css-deprecated', function ()
{
    // to remove the css class search the comment "// @deprecated"
    var CSS_CLASS_LIST = config.deprecatedClasses,
        dToday = new Date(),
        dFinalStage = new Date(config.deprecationEndDate),
        today = dToday.getTime(),
        finalStage = dFinalStage.getTime()
    ;

    _.forEach(CSS_CLASS_LIST, function(obj, key) {

        gulp
        .src(config.templates)
        .pipe(
            check(obj.regex)
        )
        .on('error', function (err) {
            if (today >= finalStage) {
                gutil.log(
                    '\n\n' +
                    gutil.colors.red('DANGER CSS CLASS Deprecated: ' + err.message +'\n') +
                    '@deprecated: ' + gutil.colors.yellow(obj.oldClass) + ', \n' +
                    '@use: ' + gutil.colors.green(obj.newClass) +
                    '\n'
                );
                gutil.log(
                    gutil.colors.red('Build Process has been stop, replace the class inside your project, the css class does not exist anymore')
                );
                process.exit(0);
            } else {
                gutil.log(
                    '\n\n' +
                    gutil.colors.yellow('WARNING CSS CLASS Deprecated: ' + err.message + '\n') +
                    '@deprecated: ' + gutil.colors.yellow(obj.oldClass) + ', \n' +
                    '@use: ' + gutil.colors.green(obj.newClass) +
                    '\n'
                );
            }

        });

    });
});

// I cannot add css-unused because output a big error
gulp.task('css-unused', function ()
{
    return gulp
    .src([config.cssDistFiles, config.htmlFiles])
    .pipe(symdiff({
        templates: [symdiffHtml],        // list all templates plugins
        css: [symdiffCss],               // list all css plugins
        ignore: config.unusedCss.ignore  // classes to ignore
    }));
});


gulp.task('css-stylelint', function ()
{
    return gulp
        .src(config.sassIndex)
        .pipe(sass().on('error', sass.logError))
        .pipe( // fontello anticache
            gulpPreprocess(config.preprocess)
        )
        .pipe(gulp.dest(config.cssTemp))
        .pipe(
            stylelint({
                reporters: [stylelintLog()]
            })
        );
});


gulp.task('css-reference', function()
{
    gulp.src( './node_modules/backstopjs/gulpfile.js' )
        .pipe( chug({tasks:['reference']}) );
});


gulp.task('css-test', function()
{
    gulp.src( './node_modules/backstopjs/gulpfile.js' )
        .pipe( chug({tasks:['test']}) );
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
        'css-stylelint',
        ['fonts','html','jade','cssVendor','css','jsVendor','js'],
        ['css-deprecated'],
        'connect','watch'
    );
});