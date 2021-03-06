﻿/*
* fs.js
* 
* Runs a set of unit tests used that check
* the functionality of the filesystem object
* 
*/

assert.suite('Module: FileSystem', function() {

	// SETUP
	var fs = require("fs");
	var testdir = "test";
	var fsdir = testdir + "/fs";
	var workingDirectory = fs.workingDirectory;

	// --------------------------------------------
	assert.section('Instantiation');
	// --------------------------------------------

	assert(!!fs, 'fs can be instantiated using require()');
	assert(typeof fs === 'object', 'fs is an object');

	// --------------------------------------------
	assert.section('Properties & methods');
	// --------------------------------------------

	assert(typeof fs.absolute === 'function', 'fs.absolute() is defined');
	assert(typeof fs.changeWorkingDirectory === 'function', 'fs.changeWorkingDirectory() is defined');
	assert(typeof fs.exists === 'function', 'fs.exists() is defined');
	assert(typeof fs.isAbsolute === 'function', 'fs.isAbsolute() is defined');
	assert(typeof fs.isDirectory === 'function', 'fs.isDirectory() is defined');
	assert(typeof fs.isExecutable === 'function', 'fs.isExecutable() is defined');
	assert(typeof fs.isFile === 'function', 'fs.isFile() is defined');
	assert(typeof fs.isLink === 'function', 'fs.isLink() is defined');
	assert(typeof fs.isReadable === 'function', 'fs.isReadable() is defined');
	assert(typeof fs.isWritable === 'function', 'fs.isWritable() is defined');
	assert(typeof fs.list === 'function', 'fs.list() is defined');
	assert(typeof fs.makeDirectory === 'function', 'fs.makeDirectory() is defined');
	assert(typeof fs.makeTree === 'function', 'fs.makeTree() is defined');
	assert(typeof fs.removeDirectory === 'function', 'fs.removeDirectory() is defined');
	assert(typeof fs.removeTree === 'function', 'fs.removeTree() is defined');
	assert(typeof fs.copyTree === 'function', 'fs.copyTree() is defined');
	assert(typeof fs.readLink === 'function', 'fs.readLink() is defined');
	assert(typeof fs.separator === 'string' && fs.separator === "\\", 'fs.separator is defined as a windows separator (\\)');
	assert(typeof fs.workingDirectory === 'string' && fs.workingDirectory.indexOf(":\\") == 1, 'fs.workingDirectory is defined and has a windows path (ie C:\\..)');
	assert(typeof fs.open === 'function', 'fs.open() is defined');
	assert(typeof fs.read === 'function', 'fs.read() is defined');
	assert(typeof fs.write === 'function', 'fs.write() is defined');
	assert(typeof fs.size === 'function', 'fs.size() is defined');
	assert(typeof fs.remove === 'function', 'fs.remove() is defined');
	assert(typeof fs.copy === 'function', 'fs.copy() is defined');
	assert(typeof fs.move === 'function', 'fs.move() is defined');
	assert(typeof fs.touch === 'function', 'fs.touch() is defined');

	// --------------------------------------------
	assert.section('Directory Functions');
	// --------------------------------------------

	fs.changeWorkingDirectory("C:\\");

	assert(fs.workingDirectory === "C:\\", 'fs.changeWorkingDirectory() will change the working directory');

	fs.changeWorkingDirectory("C:/Program Files/");

	assert(fs.workingDirectory === "C:\\Program Files", 'fs.changeWorkingDirectory() uses slash (/) and backslash(\\)');

	fs.changeWorkingDirectory(workingDirectory);

	fs.removeTree(testdir); // Make sure we start with a clean solution.

	fs.makeDirectory(testdir);

	assert(fs.exists(testdir) === true, 'fs.makeDirectory() can create a directory');

	fs.makeDirectory(fsdir);

	assert(fs.exists(fsdir) === true, 'fs.makeDirectory() can create a subdirectory');

	fs.removeDirectory(fsdir);

	assert(fs.exists(fsdir) === false, 'fs.makeDirectory() can remove a directory');
	
	fs.makeDirectory(fsdir);
	
	// --------------------------------------------
	assert.section('File Functions');
	// --------------------------------------------

	var textfile = fsdir + "/fs.txt";
	
	fs.write(textfile, 'initial text', 'w');	
	
	assert(fs.exists(textfile) === true, 'fs.write() can create files');
	assert(fs.isReadable(textfile) === true, 'fs.write() does not keep a lock on a text file when writing')
	assert(fs.read(textfile) === 'initial text', 'fs.read() can read text sucessfully');

	var size = fs.size(textfile);
	
	assert(typeof size === 'number', 'fs.size() returns a number');
	assert(size === 15, 'fs.size() returns number of bytes in a file');
	assert(fs.size(workingDirectory) === -1, 'fs.size() returns -1 for directories');

	fs.write(textfile, ', extra text', 'a');

	assert(fs.read(textfile) === 'initial text, extra text', 'fs.write() can append text sucessfully');
	assert(fs.isReadable(textfile) === true, 'fs.write() does not keep a lock on a text file when appending')
	assert(fs.size(textfile) > size, 'fs.size() file size increases when appended to');

	fs.remove(textfile);

	assert(fs.exists(textfile) === false, 'fs.remove() works properly')
	
	fs.write(textfile, 'initial text', 'w');
	
	// --------------------------------------------
	assert.section('Query Functions');
	// --------------------------------------------

	assert(fs.exists(textfile), 'fs.exists() works properly');

	assert(fs.isAbsolute(textfile) === false, 'fs.isAbsolute() returns false for relative paths');
	assert(fs.isAbsolute(workingDirectory) === true, 'fs.isAbsolute() returns true for absolute paths');
	assert(fs.isAbsolute('') === false, 'fs.isAbsolute() returns false for empty string');
	assert(fs.isAbsolute(null) === false, 'fs.isAbsolute() returns false for null');

	assert(typeof fs.absolute(textfile) === 'string', 'fs.absolute() returns a string');
	assert(fs.absolute(textfile).indexOf(':\\') == 1, 'fs.absolute returns a volume drive');
	assert.isError(function() { var a = fs.absolute('invalid'); }, 'fs.absolute() throws an error for invalid path');

	assert(fs.isFile(textfile) === true, 'fs.isFile() returns true for files');
	assert(fs.isFile(workingDirectory) === false, 'fs.isFile() returns false for directories');
	assert(fs.isFile('') === false, 'fs.isFile() returns false for empty string');
	assert(fs.isFile(null) === false, 'fs.isFile() returns false for null');

	assert(fs.isDirectory(workingDirectory) === true, 'fs.isDirectory() returns true for directories');
	assert(fs.isDirectory(textfile) === false, 'fs.isDirectory() returns false for files')
	assert(fs.isFile('') === false, 'fs.isFile() returns false for empty string');
	assert(fs.isFile(null) === false, 'fs.isFile() returns false for null');

	assert(fs.isExecutable(textfile) === false, 'fs.isExecutable() returns false for text files');
	assert(fs.isExecutable('calc.exe') === true, 'fs.isExecutable() returns true for executables');

	assert(typeof fs.list(fsdir) === 'object' && !!fs.list(testdir).push, 'fs.list() returns an array');
	assert(typeof fs.list(fsdir)[0] === 'string', 'fs.list() returns an array of strings');
	assert(fs.exists(fs.list(fsdir)[0]), 'fs.list() returns files that exist in the filesystem');
	
	// --------------------------------------------
	assert.section('Symlink Functions');
	// --------------------------------------------
	
	var linkfile = fsdir + "/sample_link.lnk";
	
	fs.makeLink(linkfile, textfile);
	
	assert(fs.exists(linkfile) === true, 'fs.makeLink() creates a symbolic link')
	assert(fs.isLink(textfile) === false, 'fs.isLink() returns false for text files');
	assert(fs.isLink(linkfile) === true, 'fs.isLink() returns true for links');
	assert(fs.readLink(linkfile) === fs.absolute(textfile), 'fs.readLink() reads a symbolic link')

	var lastModified = fs.lastModified(linkfile);

	trifle.wait(10);

	fs.touch(linkfile);
	assert(fs.lastModified(linkfile) > lastModified, 'fs.touch() updates the last modified timestamp');

	// --------------------------------------------
	assert.section('Tree Functions');
	// --------------------------------------------

	var leafdir = fsdir + '/leaf';
	var leaffile = leafdir + '/file.txt'

	var leafclone = fsdir + '/leafclone';
	var leafclonefile = leafclone + '/file.txt'

	fs.makeTree(leafdir);
	
	assert(fs.exists(fsdir) === true && fs.exists(leafdir) === true, 'fs.makeTree() can create directory trees');

	fs.write(leaffile, 'some new text', 'w');

	fs.copyTree(leafdir, leafclone);

	assert(fs.exists(leafclonefile) === true, 'fs.copyTree() can copy directory trees');

	fs.removeTree(fsdir);
	
	assert(fs.exists(fsdir) === false && fs.exists(leafdir) === false, 'fs.removeTree() can remove directory trees');

	fs.makeDirectory(fsdir);
	fs.write(textfile, 'initial text', 'w');

	// --------------------------------------------
	assert.section('Stream instantiation');
	// --------------------------------------------
	
	assert(fs.exists(textfile), 'file fs.txt exists')

	var stream = fs.open(textfile, "rw");

	assert(typeof stream === 'object', 'file stream can be instantiated');
	assert(typeof stream.atEnd === 'function', 'stream.atEnd() is defined');
	assert(typeof stream.close === 'function', 'stream.close() is defined');
	assert(typeof stream.flush === 'function', 'stream.flush() is defined');
	assert(typeof stream.read === 'function', 'stream.read() is defined');
	assert(typeof stream.readLine === 'function', 'stream.readLine() is defined');
	assert(typeof stream.seek === 'function', 'stream.seek() is defined');
	assert(typeof stream.write === 'function', 'stream.write() is defined');
	assert(typeof stream.writeLine === 'function', 'stream.writeLine() is defined');

	stream.close();
	stream = null;

	// --------------------------------------------
	assert.section('Stream object');
	// --------------------------------------------

	var pos, stream = fs.open(textfile, "r");

	assert(fs.isReadable(textfile) === false, 'fs.open(file, "r") keeps a read lock on file when reading');
	assert(fs.isWritable(textfile) === false, 'fs.open(file, "r") keeps a write lock on file when reading');
	assert(stream.read() === 'initial text', 'fs.open(file, "r") can read file sucessfully');

	stream.close();
	stream = null;

	assert(fs.isWritable(textfile) === true, 'stream.close() releases lock after reading.')

	stream = fs.open(textfile, "w");

	assert(stream.atEnd() === false, 'fs.open(file, "w") does not move writer to end of the stream');
	assert(fs.isReadable(textfile) === false, 'fs.open(file, "w") keeps a read lock on file when writing');
	assert(fs.isWritable(textfile) === false, 'fs.open(file, "w") keeps a write lock on file when writing');

	stream.write('some new text');
	stream.close();
	stream = null;

	assert(fs.read(textfile) === "some new text", 'stream.write() can write to file successfully');
	assert(fs.isWritable(textfile) === true, 'stream.close() releases write lock after writing');

	stream = fs.open(textfile, "a");

	assert(stream.atEnd() === true, 's.open(file, "a") moves writer to end of the stream');
	assert(fs.isReadable(textfile) === false, 'fs.open(file, "a") keeps a read lock on file when appending');
	assert(fs.isWritable(textfile) === false, 'fs.open(file, "a") keeps a write lock on file when appending');

	stream.write(', more text');
	stream.close();
	stream = null;

	assert(fs.read(textfile) === "some new text, more text", 'stream.write() can write to file successfully');
	assert(fs.isWritable(textfile) === true, 'stream.close() releases write lock after appending');

	// reset file to original
	fs.remove(textfile);
	fs.write(textfile, 'original text');

	stream = fs.open(textfile, "rw+");

	assert(stream.atEnd() === true, 'fs.open(file, "rw+") moves writer to end of the stream');
	assert(fs.isReadable(textfile) === false, 'fs.open(file, "rw+") keeps a read lock on file when writing');
	assert(fs.isWritable(textfile) === false, 'fs.open(file, "rw+") keeps a write lock on file when writing');

	stream.writeLine(', appended text');
	var content = stream.read();
	//console.log(content);

	stream.close();
	stream = null;

	//aassert(content === "original text, appended text\n", 'fs.open(file, "rw+") should be able to both append and read a file');
	assert(fs.isWritable(textfile) === true, 'stream.close() releases write lock after appending.');
	assert(fs.isReadable(textfile) === true, 'stream.close() releases read lock after appending.');

	stream = fs.open(textfile, "w");
	stream.seek(fs.size(textfile));

	assert(stream.atEnd() === true, 'fs.seek() can position the cursor at the end of file');

	stream.close();
	stream = null;

	// --------------------------------------------
	assert.section('File locking');
	// --------------------------------------------

	assert(fs.isWritable(textfile) === true, 'fs.isWritable() returns true for general files');
	assert(fs.isReadable(textfile) === true, 'fs.isReadable() returns true for general files')
	var f = fs.open(textfile, 'w');
	f.write('');
	assert(fs.isWritable(textfile) === false, 'fs.isWritable() returns false when files are being written to');
	assert(fs.isReadable(textfile) === false, 'fs.isReadable() returns false when files are being written to');
	f.close();
	f = null;

	// TEARDOWN
	fs.removeTree(fsdir);

});

