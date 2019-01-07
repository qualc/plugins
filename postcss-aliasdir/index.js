'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-aliasdir', function (cursdir) {
    return function (css, result) {
        var cssText = css.toString();
        for (let key in cursdir) {
            let patt = new RegExp(key, 'g');
            cssText = cssText.replace(patt, `${cursdir[key]}`);
        }
        result.root = postcss.parse(cssText);;
    }
});
