var buster = require('buster');
buster.spec.expose();

var bundle = require('../');

describe('bundle.js', function () {

  it('exposes itself as a function', function () {
    expect(bundle).toBeFunction();
  });

  it('takes file name and options as argument', function () {
    expect(bundle.length).toEqual(2); 
  });

  it('throws on nonexistent file', function () {
    expect(function () { bundle('no_such_file.js') }).toThrow('Error');
  });

  it('returns contents of given file', function () {
    expect('nobundle.js').toBundleTo('var empty;');
  });

  it('substitutes "// bundle file" with file contents', function () {
    expect('bundle.js').toBundleTo('var one = 1;');
  });

  it('substitutes multiple bundled files with their contents', function () {
    expect('multiple.js').toBundleTo('var one = 1;\nvar two = 2;');
  });

  it('supports nested bundle statements', function () {
    expect('nested.js').toBundleTo('var nested;');
  });

  it('handles directories in bundle filename', function () {
    expect('directories.js').toBundleTo('var directories;'); 
  });

  it('bundles complex example', function () {
    expect('complex.js').toBundleTo(';(function () {\n  var one = 1;\n})();\n;(function () {\n  var two = 2;\n  var nested;\n})();');
  });
  
  it('supports uglify-js compression after bundling', function () {
    var result = bundle('test/fixtures/complex.js', { compress: true });
    expect(result).toEqual('(function(){var a=1})(),function(){var a=2,b}()');
  })

});

buster.assertions.add("bundle", {
  assert: function (file, bundled) {
    file = 'test/fixtures/' + file;
    this.file = file;
    this.actual = bundle(file);
    return this.actual === bundled;
  },
  assertMessage: 'Expected bundled file "${file}" to have contents ${1}, but was ${actual}',
  refuteMessage: 'Expected bundled file "${file}" not to have contents ${1}, but it was ${actual}',
  expectation: 'toBundleTo'
});
