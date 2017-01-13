var gulp = require('gulp'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),
    bourbon = require('node-bourbon'),
    ngmin = require('gulp-ngmin'),
    concat = require('gulp-concat'),
    stylesPath = './client/style/sass/*.scss',
    scriptsPath = './client/script/controllers/*.js'

gulp.task('scripts', function () {
    return gulp.src(scriptsPath)
        .pipe(concat('controllers.js'))
        .pipe(ngmin({dynamic: true}))
        .pipe(gulp.dest('./client/script/'));
});

gulp.task('sass', function () {
    gulp.src(stylesPath)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./client/style/'));
});

gulp.task('scripts:watch', function () {
    gulp.watch(scriptsPath, ['scripts']);
});

gulp.task('sass:watch', function () {
    gulp.watch(stylesPath, ['sass']);
});

gulp.task('watch', ['sass:watch']);