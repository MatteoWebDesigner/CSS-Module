var config = {
    localhost:     "http://localhost:8080",
    port:          "8080",
    clean:         ['temp','dist'],
    distFiles:     "dist/*",
    fontFiles :    "src/fonts/**/*",
    fontDist :     "dist/fonts/",
    htmlFiles:     "src/html/*.html",
    jadeFiles:     "src/views/**/*.jade",
    jadePageFiles: "src/views/pages/**/*.jade",
    htmlDist:      "dist/",
    cssFiles:      "src/css/**/*.css",
    tempFiles:     "temp/*",
    cssTemp:       "temp/css/",
    cssDist:       "dist/css/",
    cssDistFiles:  "dist/css/*.css",
    jsMain:        "src/js/main.js",
    jsFiles:       "src/js/**/*.js",
    jsDist:        "dist/js/",
    assetsFiles:   "src/assets/**/*",
    assetsDist:    "dist/assets/",
    vendor: {
        js: [
            "bower_components/lodash/dist/lodash.core.min.js", // if you want complete lodash remove core
            "bower_components/moment/min/moment.min.js"
        ]
    },
    browserSupport: ['ie >= 9', '> 1%'],
    cssBundle: {
        'site' : [
            { moduleName:'setting', fileName:'theme', abstract:true },
            { moduleName:'component', fileName:'card' },
            { moduleName:'component', fileName:'card', external:'spa' },
            { moduleName:'trump', fileName:'typo' },
            { moduleName:'section', fileName:'index' }
        ],
        'spa' : [
            { moduleName:'component', fileName:'card' },
            { moduleName:'trump', fileName:'typo' }
        ]
    },
    csslint : {
        rules: {
            "no-duplicate-selectors": true
        },
        reporters: [
            {formatter: 'string', console: true}
        ],
        debug: true
    },
    templates: [
        'src/views/**/*.jade',
        'src/js/**/*.js'
    ],
    preprocess: {
        context: { ANTICACHE : new Date().getTime() }
    }
};

module.exports = config;