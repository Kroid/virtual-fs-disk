var path = require('path');


var helper = {
  absolutePath: absolutePath,
  relativePath: relativePath
};


module.exports = helper;


function absolutePath(basePath, _path, isolate) {
  _path = path.normalize(_path);

  isolate = isolate === undefined ? true : !!isolate;

  if (isolate && _path.split(path.sep)[0] === '..') {
    return null;
  }

  return path.join(basePath, _path);
}


function relativePath(basePath, _path, isolate) {
  _path = path.relative(basePath, _path);

  isolate = isolate === undefined ? true : !!isolate;

  if (isolate && _path.split(path.sep)[0] === '..') {
    return null;
  }

  return _path;
}