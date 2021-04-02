var fs = require('fs');
var debug = require('debug')('bundle');

module.exports = function (file, options) {

  var content,
      options = options || {},
      stat = fs.statSync(file);

  if (!stat.isFile()) {
    throw new Error('No such file "' + file + '"');
  }

  content = bundle(file);

  if (options.compress) {
    debug('compressing result..'); 
    return compress(content);
  }

  debug('done!');
  return content; 
};

var bundleRegex = /\/\/\s*bundle (.*)/g;

function bundle (file) {
  debug(file + '..');
  var content = fs.readFileSync(file).toString().trim();
  return content.replace(bundleRegex, function (ignore, match) {
    var path = folderOf(file) + match.trim();
    return bundle(path);
  });
}

function folderOf (file) {
  var folder = '';
  if (file.indexOf('/') != -1) {
    folder += file.substr(0, file.lastIndexOf('/') + 1);
  }
  return folder;
}

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
function compress (content) {
  var ast = jsp.parse(content); // parse code and get the initial AST
  ast = pro.ast_mangle(ast);    // get a new AST with mangled names
  ast = pro.ast_squeeze(ast);   // get an AST with compression optimizations
  var compressed = pro.gen_code(ast);     // compressed code here
  debug('done!');
  return compressed;
}
