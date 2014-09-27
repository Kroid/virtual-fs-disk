var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    Adapter = require('./../index');


describe('Adapter disk', function() {
  var basePath,
      adapter;

  beforeEach(function(done) {
    basePath = path.join(__dirname, 'sandbox');
    adapter = new Adapter({basePath: basePath});
    done();
  });

  it('Should copy directory with files', function(done) {
    adapter.copy('copy/src/dir', 'copy/dest/dir', function(err, data) {
      assert.equal(true, !err);

      fs.exists(path.join(basePath, 'copy/dest/dir/file'), function(exists) {
        assert.equal(true, exists);

        done();
      });
    });
  });

  it('Should create directory', function(done) {
    adapter.createDirectory('/create/directory', function(err, data) {
       assert.equal(true, !err);

       fs.exists(path.join(basePath, '/create/directory'), function(exists) {
         assert.equal(true, exists);

         fs.stat(path.join(basePath, '/create/directory'), function(err, stat) {
           assert.equal(true, !err);
           assert.equal(true, stat.isDirectory());

           assert.equal('directory', data.type);
           assert.equal('create/directory', data.path);

           done();
         });
       });
     });
  });

  it('Should create file', function(done) {
     adapter.createFile('/create/directory-with-file/file', 'some data', function(err, resp) {
       assert.equal(true, !err);

       fs.exists(path.join(basePath, '/create/directory-with-file/file'), function(exists) {
         assert.equal(true, exists);

         fs.stat(path.join(basePath, '/create/directory-with-file/file'), function(err, stat) {
           assert.equal(true, !err);
           assert.equal(true, stat.isFile());

           fs.readFile(path.join(basePath, '/create/directory-with-file/file'), {encoding: 'utf8'}, function(err, data) {
             assert.equal(true, !err);
             assert.equal('some data', data);

             assert.equal('some data', resp.content);
             assert.equal('file', resp.type);
             assert.equal('create/directory-with-file/file', resp.path);

             done();
           });
         });
       });
     });
  });

  it('Should get list of files and directories', function(done) {
     adapter.list('list', function(err, res) {
       assert.equal(true, !err)
       assert.equal(4, res.length);

       var count = 4;
       res.map(function(file) {
         if (file.type === 'file') {
           if (file.name === 'fileA' && file.path === 'list') {
             count--;
           }
           if (file.name === 'fileB' && file.path === 'list') {
             count--;
           }
         }

         if (file.type === 'directory') {
           if (file.name === 'dirA' && file.path === 'list') {
             count--;
           }
           if (file.name === 'dirB' && file.path === 'list') {
             count--;
           }
         }
       });

       assert.equal(0, count);

       done();
     });
  });

  it('Should move directory with files', function(done) {
     adapter.move('move/src/dir', 'move/dest/dir', function(err, data) {
       assert.equal(true, !err);

       fs.exists(path.join(basePath, 'move/dest/dir/file'), function(exists) {
         assert.equal(true, exists);
         fs.exists(path.join(basePath, 'move/dest/dir/anotherFile'), function(exists) {
           assert.equal(true, exists);
           done();
         });
       });
     });
  });

  it('Should read file', function(done) {
    adapter.read('read/README.md', function(err, data) {
       assert.equal(true, !err);
       assert.equal('some data\n', data.content);

       done();
     })
  });

  it('Should error on read directory', function(done) {
    adapter.read('read/unreadable', function(err, data) {
       assert.equal(true, !!err);
       assert.equal(true, !data);

       done();
     });
  });

  it('Should rename file', function(done) {
    adapter.rename('rename', 'oldname', 'newname', function(err, resp) {
      assert.equal(true, !err);

      fs.exists(path.join(basePath, 'rename/oldname'), function(exists) {
        assert.equal(false, exists);
        fs.exists(path.join(basePath, 'rename/newname'), function(exists) {
          assert.equal(true, exists);

          done();
        });
      });
    });
  });

  it('Should remove directory with files', function(done) {
    adapter.remove('remove/dir', function(err) {
       assert.equal(true, !err);

       fs.exists(path.join(basePath, 'remove/dir'), function(exists) {
         assert.equal(false, exists);
         done();
       });
     });
  });

  it('Should write content to file', function(done) {
    adapter.write('write/file', 'some data', function(err) {
       assert.equal(true, !err);

       fs.readFile(path.join(basePath, 'write/file'), {encoding: 'utf-8'}, function(err, content) {
         assert.equal(true, !err);

         assert.equal('some data', content);

         done();
       });
     });
  });
});
