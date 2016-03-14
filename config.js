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
    sassIndex:     "src/scss/main.scss",
    sassFiles:     "src/scss/**/*.scss",
    tempFiles:     "temp/*",
    cssTemp:       "temp/css/",
    cssDist:       "dist/css/",
    cssDistFiles:  "dist/css/*.css",
    jsMain:        "src/js/main.js",
    jsFiles:       "src/js/**/*.js",
    tagFiles:       "src/js/**/*.tag",
    jsDist:        "dist/js/",
    vendor: {
        css: [
            "bower_components/prism/themes/prism.css", // or use okaidia
        ],
        js: [
            "bower_components/lodash/dist/lodash.core.min.js", // if you want complete lodash remove core
            //"bower_components/moment/min/moment.min.js",
            "bower_components/clipboard/dist/clipboard.min.js",
            "bower_components/prism/prism.js"
            //"bower_components/riot/riot.min.js",
        ]
    },
    csslint : {
        'adjoining-classes': false,
        'box-model': false,
        'box-sizing': false,
        'compatible-vendor-prefixes': false,
        'important': false,
        'outline-none': false,
        'order-alphabetical': false,
        'font-sizes': false,
        'qualified-headings': false,
        'unqualified-attributes': false,
        'regex-selectors': false,
        'unique-headings': false,
        'universal-selector': false,
        'zero-units': false
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