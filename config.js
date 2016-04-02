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
    tagFiles:      "src/js/**/*.tag",
    jsDist:        "dist/js/",
    assetsFiles:   "src/assets/**/*",
    assetsDist:    "dist/assets/",
    vendor: {
        js: [
            "bower_components/lodash/dist/lodash.core.min.js", // if you want complete lodash remove core
            "bower_components/moment/min/moment.min.js"
        ]
    },
    browserSupport: ['ie >= 6', '> 1%'],
    cssBundle: {
        "site" : [
            { moduleName: 'component', fileName : 'card' },
            { moduleName: 'trump', fileName : 'typo' }
        ],
        "spa" : [
            { moduleName: 'component', fileName : 'card' },
            { moduleName: 'trump', fileName : 'typo' }
        ]
    },
    csslint : {
        "rules": {
            // "adjoining-classes": false,
            // "box-model": false,
            // "box-sizing": false,
            // "compatible-vendor-prefixes": false,
            // "important": false,
            // "outline-none": false,
            // "order-alphabetical": false,
            // "font-sizes": false,
            // "qualified-headings": false,
            // "unqualified-attributes": false,
            // "regex-selectors": false,
            // "unique-headings": false,
            // "universal-selector": false,
            // "zero-units": false
        },
        debug: true
    },
    templates: [
        'src/views/**/*.jade',
        'src/js/**/*.js'
    ],
    deprecationEndDate: '2016, 2, 28', // (yyyy, mm, dd) keep in mind month start from 0
    deprecatedClasses : [{
        regex: /("|'| )old-class("|'| )/g,
        oldClass: 'old-class',
        newClass: 'new-class'
    }],
    preprocess: {
        context: { ANTICACHE : new Date().getTime() }
    }
};

module.exports = config;