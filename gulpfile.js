"use strict";

const sass = require('gulp-sass');
const del = require('del');
const path = require('path');
const { src , dest, watch, series } = require('gulp');
const SCSS_SRC = path.join(__dirname,'dev/scss/**/*.scss');
const SCSS_DEST = path.join(__dirname,'dist/css/');
sass.compiler = require('node-sass');

const refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000,
    basepath= 'dist/';

    var server = express();
    //Add livereload middleware before static-middleware
    server.use(livereload({
      port: livereloadport
    }));
    server.use(express.static(path.join(__dirname, basepath)));
    


function compiler_SCSS(cb){
  return src (SCSS_SRC)
  .pipe(sass({outputStyle: 'expanded'})).on('error', sass.logError)
  .pipe(dest(SCSS_DEST))
  .pipe(refresh(lrserver));
  cb()
}
function copyImg(cb){
  return src ('dev/assets/images/**/*')
  .pipe(dest('dist/img'))
  .pipe(refresh(lrserver));
  cb()
}
function watch_scss(cb){
  watch(SCSS_SRC, series(cleanCss, compiler_SCSS));
  cb()
}

function cleanCss (cb) {
  del(SCSS_DEST);
  cb()
}
function upserver(cb) {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);
  cb()
}


exports.default = series(upserver, copyImg, watch_scss);
 


