module.exports = Adapter;


var path = require('path'),
    _ = require('lodash')
    fse = require('fs-extra'),
    pathHelper = require('./lib/pathHelper');


/**
 * Adapter api:
 *
 * @function copy
 * @function createDirectory
 * @function createFile
 * @function list
 * @function move
 * @function read
 * @function remove
 * @function rename
 * @function watch
 * @function write
 *
 */

function Adapter(options) {
  if (!options) {
    options = {};
	}

  this.basePath = options.basePath || '/';
  this.isolate = options.isolate === undefined ? true : !!isolate;
}


Adapter.prototype.absolutePath = function(_path) {
  return pathHelper.absolutePath(this.basePath, _path, this.isolate);
}


Adapter.prototype.relativePath = function(_path) {
  return pathHelper.relativePath(this.basePath, _path, this.isolate);
}


/**
 *
 * @param {string} src - Relative 'from' path
 * @param {string} dest - Relative 'to' path
 * @param {function} cb - Callback function with args (err, res)
 */
Adapter.prototype.copy = function(src, dest, cb) {
  var srcAbs = this.absolutePath(src),
      srcRel = this.relativePath(src),

      destAbs = this.absolutePath(dest),
      destRel = this.relativePath(dest);

  fse.copy(srcAbs, destAbs, function(err) {
    if (err) { return cb(err); }
    return cb(null, {src: srcRel, dest: destRel});
  });
}


/**
 *
 * @param {string} _path
 * @param {function} cb
 */
Adapter.prototype.createDirectory = function(_path, cb) {
  var absPath = this.absolutePath(_path),
      relPath = this.relativePath(absPath);

  fse.ensureDir(absPath, function(err) {
    if (err) { return cb(err); }

    cb(null, {
      path: relPath,
      type: 'directory'
    });
  });
};


/**
 *
 * @param {string} _path
 * @param {string || buffer} [content]
 * @param {object} [options]
 * @param {function} cb
 */
Adapter.prototype.createFile = function(_path, content, options, cb) {
  if (arguments.length === 2 && typeof content === 'function') {
    cb = content;
    content = null;
    options = {};
  }

  if (arguments.length === 3 && typeof options === 'function') {
    cb = options;
    options = {};
  }

  options.encoding = options.encoding || 'utf8';
  options.flag = options.flag || 'w';

  var absPath = this.absolutePath(_path),
      relPath = this.relativePath(absPath);

  fse.exists(absPath, function(exists) {
    if (exists) { return cb({error: 'exists'}); }

    fse.ensureFile(absPath, function(err) {
      if (err) { return cb(err); }

      fse.writeFile(absPath, content, options, function(err, data) {
        if (err) { return cb(err); }

        fse.readFile(absPath, {encoding: 'utf8'}, function(err, data) {
          if (err) { return cb(err); }

          cb(null, {
            content: data,
            path: relPath,
            type: 'file'
          });
        });
      });
    })
  });
};


/**
 *
 * @param {string} _path
 * @param {function} cb
 */
Adapter.prototype.list = function(_path, cb) {
  var absPath = this.absolutePath(_path),
    relPath = this.relativePath(absPath);

  fse.readdir(absPath, function(err, arr) {
    if (err) { return cb(err); }

    var result = [];

    var done = _.after(arr.length, function() {
      cb(null, result);
    });

    _.forEach(arr, function(ele) {
      fse.stat(path.join(absPath, ele), function(err, stats) {
        if(err) { return cb(err); }

        var obj = {
          path: _path,
          name: ele
        };

        if (stats.isDirectory()) { obj.type = "directory"; }
        if (stats.isFile()) { obj.type = "file"; }

        result.push(obj);
        done();
      });
    });
  });
};


/**
 *
 * @param {string} src
 * @param {string} dest
 * @param {function} cb
 */
Adapter.prototype.move = function(src, dest, cb) {
  var srcAbs = this.absolutePath(src),
      srcRel = this.relativePath(src),

      destAbs = this.absolutePath(dest),
      destRel = this.relativePath(dest);

  fse.move(srcAbs, destAbs, function(err) {
    if (err) { return cb(err); }

    cb(null, {
      src: srcRel,
      dest: destRel
    });
  });
};


/**
 *
 * @param {string} _path
 * @param {object} [options]
 * @param {function} cb
 */
Adapter.prototype.read = function(_path, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {
      encoding: 'utf-8'
    };
  }

  var absPath = this.absolutePath(_path),
      relPath = this.relativePath(absPath);

  fse.stat(absPath, function(err, stat) {
    if (err) { return cb(err) }
    if (stat.isDirectory()) { return cb({error: relPath + ' is directory'}) }

    if (stat.isFile()) {
      fse.readFile(absPath, options, function(err, content) {
        if (err) { return cb(err); }

        cb(null, {
          content: content,
          path: relPath,
          type: 'file'
        });
      });
      return;
    }
    cb({error: 'undefined error'});
  });
};


/**
 *
 * @param {string} _path
 * @param {function} cb
 */
Adapter.prototype.remove = function(_path, cb) {
  var absPath = this.absolutePath(_path),
      relPath = this.relativePath(absPath);

  fse.remove(absPath, function(err) {
    cb(err || null);
  });
};


/**
 *
 * @param {string} path
 * @param {string} oldName
 * @param {string} newName
 * @param {function} cb
 */
Adapter.prototype.rename = function(_path, oldName, newName, cb) {
  this.move(path.join(_path, oldName), path.join(_path, newName), cb);
};


Adapter.prototype.write = function(_path, content, options, cb) {
  if(typeof options === 'function') {
    cb = options;
    options = {
      encoding: 'utf8'
    };
  }

  var absPath = this.absolutePath(_path),
      relPath = this.relativePath(absPath);

  fse.writeFile(absPath, content, options, function(err) {
    if (err) { return cb(err); }

    cb(null);
  });
};

