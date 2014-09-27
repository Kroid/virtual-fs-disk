var assert = require('assert'),
    pathHelper = require('./../lib/pathHelper');


describe('pathHelper', function() {
  var basePath;

  beforeEach(function() {
      basePath = '/base/path';
  });

  it('isolate mode, absolute path', function() {
    assert.equal(basePath, pathHelper.absolutePath(basePath, ''));

    assert.equal(basePath + '/', pathHelper.absolutePath(basePath, '/'));
    assert.equal(basePath + '/', pathHelper.absolutePath(basePath, '/.././../../'));
    
    assert.equal(basePath + '/bar', pathHelper.absolutePath(basePath, '/bar'));

    assert.equal(null, pathHelper.absolutePath(basePath, '../'));
    assert.equal(null, pathHelper.absolutePath(basePath, '../../'));
  });

  it('isolate mode, relative path', function() {
    assert.equal('', pathHelper.relativePath(basePath, basePath));
    assert.equal('bar', pathHelper.relativePath(basePath, basePath + '/bar'));
    assert.equal('bar/file.md', pathHelper.relativePath(basePath, basePath + '/bar/file.md'));

    assert.equal(null, pathHelper.relativePath(basePath, '/'));
    assert.equal(null, pathHelper.relativePath(basePath, ''));

    assert.equal(null, pathHelper.relativePath(basePath, '/base'));
    assert.equal(null, pathHelper.relativePath(basePath, '/base/path/../'));

    assert.equal(null, pathHelper.relativePath(basePath, '/../'));
    assert.equal(null, pathHelper.relativePath(basePath, '/../../'));

    assert.equal(null, pathHelper.relativePath(basePath, './../../'));
    assert.equal(null, pathHelper.relativePath(basePath, './../'));
  });

  it('unisolate mode, absolute path', function() {

    assert.equal(basePath, pathHelper.absolutePath(basePath, '', false));
    assert.equal(basePath + '/', pathHelper.absolutePath(basePath, '/', false));

    assert.equal(basePath + '/bar/file.md', pathHelper.absolutePath(basePath, 'bar/file.md', false));
    assert.equal(basePath + '/bar/file.md', pathHelper.absolutePath(basePath, '/bar/file.md', false));

    assert.equal('/base/', pathHelper.absolutePath(basePath, '../', false));
    assert.equal('/', pathHelper.absolutePath(basePath, '../../', false));
    assert.equal('/', pathHelper.absolutePath(basePath, '../../.././..', false));
  });

  it('unisolate mode, relative path', function() {
    assert.equal('', pathHelper.relativePath(basePath, basePath, false));
    assert.equal('bar', pathHelper.relativePath(basePath, basePath + '/bar', false));
    assert.equal('bar/file.md', pathHelper.relativePath(basePath, basePath + '/bar/file.md', false));

    assert.notEqual('', pathHelper.relativePath(basePath, '', false));

    assert.equal('..', pathHelper.relativePath(basePath, '/base', false));

    assert.equal('../..', pathHelper.relativePath(basePath, '/', false));
    assert.equal('../..', pathHelper.relativePath(basePath, '/../../../../', false));
  });

});
