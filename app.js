var fs = require('fs');
var cheerio = require('cheerio');

var bulk = (function() {
  'use strict';

  function bulk(args) {
    // enforces new
    if (!(this instanceof bulk)) {
      return new bulk(args);
    }
    // constructor body
  }

  /**
   * fileDir  要修改的文件目录
   * fileArr  要修改的文件数组
   * dist  ouput file fileDir
   */
  bulk.prototype = {
    fileDir: null,
    fileArr: [],
    dist: 'dist',
  };

  bulk.prototype.init = function(args) {

    for (var prop in args) {
      if (args.hasOwnProperty(prop)) {
        this[prop] = args[prop];
      }
    }

    var _this = this;

    if (_this.fileDir) {
      _this.getFileDir();
      return;
    } else {
      return;
    }

    if (!_this.fileArr.length) {
      _this.onError();
      return;
    } else {
      _this.run();
    }

  };

  bulk.prototype.onError = function() {
    console.warn('Place Set your file Arr Before Start!');
  };

  bulk.prototype.run = function() {

    var _this = this;

    if (!_this.fileArr.length) {
      return;
    }

    fs.rmdir(_this.dist, function(err) {
      if (err) throw err;

      fs.mkdir(_this.dist, function(err) {
        if (err) throw err;

        for (var i = 0; i < _this.fileArr.length; i++) {

          _this.readFile(_this.fileArr[i], function(data, f) {

            var h = _this.updateHtml(data.toString());
            _this.createNewFile(f, h.toString());

          });

        };

      });

    });

  };

  bulk.prototype.updateHtml = function(str) {

    console.log('Start Update Str');

    var html = '';
    var $ = null;

    $ = cheerio.load(str);

    $('a').attr('href', '');

    html = $.html();

    return html;
  };

  bulk.prototype.readFile = function(file, callback) {

    fs.readFile(file, function(err, data) {

      if (err) throw err;

      if (callback) {
        callback(data, file);
      }

    });

  };

  bulk.prototype.createNewFile = function(file, html) {

    var _this = this;

    var f = file.split('/');
    var fileName = '';

    if (f.length) {
      fileName = f[f.length - 1];
    } else {
      console.log('err');
      return;
    }

    var src = _this.dist + '/' + fileName;

    fs.writeFile(src, html, function(err) {
      if (err) throw err;

      console.log(src + ', It\'s Success!');

    });

  };

  bulk.prototype.getFileDir = function() {

    var _this = this;

    var mid = '/';

    if (_this.fileDir.charAt(_this.fileDir.length - 1) === '/') {
      mid = '';
    }

    fs.readdir(_this.fileDir, function(err, files) {

      if (err) throw err;

      for (var i = 0; i < files.length; i++) {

        files[i] = _this.fileDir + mid + files[i];

      };

      if (_this.fileArr.length) {

        _this.fileArr = _this.fileArr.concat(files);

      } else {

        _this.fileArr = files;

      }

      _this.run();
    });
  };

  return bulk;
}());



var b = new bulk();

b.init({
  fileDir: './html',
  fileArr: ['x/a.txt']
});