#! /bin/sh

rm -rf test/sandbox

mkdir test/sandbox
mkdir test/sandbox/copy
mkdir test/sandbox/copy/src
mkdir test/sandbox/copy/src/dir
touch test/sandbox/copy/src/dir/file

mkdir test/sandbox/list
mkdir test/sandbox/list/dirA
mkdir test/sandbox/list/dirB
touch test/sandbox/list/fileA
touch test/sandbox/list/fileB

mkdir test/sandbox/move
mkdir test/sandbox/move/src
mkdir test/sandbox/move/src/dir
touch test/sandbox/move/src/dir/file
touch test/sandbox/move/src/dir/anotherFile

mkdir test/sandbox/read
mkdir test/sandbox/read/unreadable
echo 'some data' > test/sandbox/read/README.md

mkdir test/sandbox/rename
touch test/sandbox/rename/oldname

mkdir test/sandbox/remove
mkdir test/sandbox/remove/dir
touch test/sandbox/remove/dir/somefile

mkdir test/sandbox/write
touch test/sandbox/write/file

rm -rf test/sandbox