(function(){
    'use strict';

    // dependencies
    var riot = require('riot'), // riotify need this
        componentWrapper = require('./component-wrapper.tag'),
        codeWrapper = require('./code-wrapper.tag'),
        copyButton = require('./copy-button.tag'),
        toogleButton = require('./toggle-button.tag'),
        codeExample = require('./code-example.tag')
    ;

    // init riot mount
    riot.mount('*');
})();