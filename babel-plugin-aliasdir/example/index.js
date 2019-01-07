const paths = require('path');
function replaceFileName(filename) {
    if (!filename) return filename;
    if (filename.indexOf('/') === -1) return '/';
    return filename.replace(/(.*)\/.*$/, '$1');
}
function replaceFilePrefix(filename) {
    if (!filename) return filename;
    // if (filename.indexOf('/') === -1) return filename = './' + filename;
    return filename.replace(/\.+(\/.+)/, '$1');
}
function filePrefix(filepath) {
    if (!filepath) return filepath;
    return filepath.replace(/[^/]*\/([^/]+).*/, '$1');
}
function replaceDir(filepath) {
    if (!filepath) return filepath;
    return filepath.replace(/\\\\?/g, '/');

}
let cursName = '/src/lib/t.js',
    filenameRelative = replaceFileName(replaceFilePrefix('D:/project/src/controller/management/demo/aController.js'));
let filesp = filenameRelative.split('/');
let index = filesp.indexOf(filePrefix(cursName));
if (~index) {
    filenameRelative = '/' + filesp.slice(index).join('/');
}

let newPath = paths.relative(replaceDir(filenameRelative), replaceDir(cursName));

console.log(newPath);