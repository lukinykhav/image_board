'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
//coffee = require('gulp-coffee');
    nodemon = require('gulp-nodemon');

//gulp.task('coffee', function() {
//    gulp.src('./*.coffee')
//        .pipe(coffee({bare: true}).on('error', gutil.log))
//        .pipe(gulp.dest('./public/'));
//});

gulp.task('sass', function () {
    return gulp.src('./client/style/sass/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./client/style/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', function() {
    console.log(123);
});

gulp.task('nodemon', function () {
    nodemon({
        script: 'app.js'
        , ext: 'js html css sass scss coffee'
        , env: { 'NODE_ENV': 'development' }
    });
});
// not work yet
//var html2jade = require('gulp-html2jade');
//var options = {nspaces:2};
//gulp.task('jade', function(){
//    gulp.src('index.html')
//        .pipe(html2jade(options))
//        .pipe(gulp.dest('dist'));
//});
