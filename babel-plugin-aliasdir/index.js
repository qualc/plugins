const paths = require('path');
//babel-plugin-aliasdir
module.exports = function ({ types }) {
    // let projectRoot = replaceDir(__dirname).split('/node_modules/')[0];
    // console.log(projectRoot);

    /**
     * 去掉最后一层
     * @example
     * 
     * /a/b/index.js  =>  /a/b
     * /a/b   =>  /a
     * a.js  =>  '/'
     * @param {*} filename 
     */
    function replaceFileName(filename) {
        if (!filename) return filename;
        if (filename.indexOf('/') === -1) return '/';
        return filename.replace(/(.*)\/.*$/, '$1');
    }

    /**
     * 去掉前面的.
     * @example
     * 
     * ../a/b/index => /a/b/index.js
     * ./a/b/index => /a/b/index.js
     * @param {*} filename 
     */
    function replaceFilePrefix(filename) {
        if (!filename) return filename;
        return filename.replace(/\.+(\/.+)/, '$1');
    }

    /**
     * 替换\ 
     * @example
     * \\a\\b\\index.js => /a/b/index.js
     * \a\b\index.js => /a/b/index.js
     * @param {*} filepath 
     */
    function replaceDir(filepath) {
        if (!filepath) return filepath;
        return filepath.replace(/\\\\?/g, '/');

    }
    /**
     * 获取目录第一层
     * 
     * /a/b/index.js => a
     * ../a/b/index.js  => a
     * @param {*} filepath 
     */
    function filePrefix(filepath) {
        if (!filepath) return filepath;
        return filepath.replace(/[^/]*\/([^/]+).*/, '$1');
    }
    
    /**
     * 判断是否为url
     * @param {*} filepath 
     */
    function isUrl(filepath){
        return !!/^(ht|f)tps?:\/\/[\w\-]+(\.[\w\-]+)*\//
    }

    /**
     * 返回新的地址
     * @param {*} filenameRelative 
     * @param {*} cursName 
     */
    function returnNewsPath(filenameRelative, cursName) {
        let filesp = filenameRelative.split('/');
        let index = filesp.indexOf(filePrefix(cursName));
        if (~index) {
            filenameRelative = '/' + filesp.slice(index).join('/');
        }
        let newPath = paths.relative(replaceFileName(replaceFilePrefix(filenameRelative)), cursName);
        return replaceDir(newPath)
    }

    return {
        name: "babel-plugin-aliasdir",
        visitor: {
            ImportDeclaration(path, state) {
                let cursdir = state.opts.cursdir || null;
                if (cursdir) {
                    for (let key in cursdir) {
                        let patt = new RegExp(`^${key}\/`);
                        if (!patt.test(path.node.source.value)) continue;
                        let cursName = path.node.source.value.replace(patt, `${cursdir[key]}/`),
                            filenameRelative = state.file.opts.filenameRelative;

                        path.node.source.value = returnNewsPath(filenameRelative, cursName);
                    }
                }
            },
            VariableDeclaration(path, state) {
                let cursdir = state.opts.cursdir || null;
                if (cursdir) {
                    path.node.declarations.forEach(item => {
                        if (types.isCallExpression(item.init)) {
                            item.init.arguments.forEach(citem => {
                                for (let key in cursdir) {
                                    let patt = new RegExp(`^${key}\/`);
                                    if (!patt.test(citem.value)) continue;
                                    if(isUrl(patt)) {
                                        return citem.value = citem.value.replace(patt, `${cursdir[key]}/`);
                                    }
                                    let cursName = citem.value.replace(patt, `${cursdir[key]}/`),
                                        filenameRelative = state.file.opts.filenameRelative;
                                    citem.value = returnNewsPath(filenameRelative, cursName);
                                }
                            });
                        }
                    });
                }
            }
        }
    }
};