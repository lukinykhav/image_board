var gulp = require('gulp'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),
    bourbon = require('node-bourbon'),
    ngmin = require('gulp-ngmin'),
    concat = require('gulp-concat'),
    stylesPath = './client/style/sass/*.scss',
    scriptsPath = './client/script/*.js',
    distPath = './client';

gulp.task('scripts', function () {
    return gulp.src(scriptsPath)
        .pipe(concat('all.js'))
        .pipe(ngmin({dynamic: true}))
        .pipe(gulp.dest(distPath));
});

gulp.task('sass', function () {
    gulp.src(stylesPath)
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(concat('style/main.css'))
        .pipe(gulp.dest(distPath));
});


// gulp.task('sass', function () {
//     return gulp.src('./client/style/sass/*.scss')
//         .pipe(sass.sync().on('error', sass.logError))
//         .pipe(gulp.dest('./client/style/css'));
// });

gulp.task('scripts:watch', function () {
    gulp.watch(scriptsPath, ['scripts']);
});

gulp.task('sass:watch', function () {
    gulp.watch(stylesPath, ['sass']);
});

gulp.task('watch', ['sass:watch', 'scripts:watch']);

gulp.task('nodemon', function () {
    nodemon({
        script: 'app.js'
        , ext: 'js html css sass scss coffee'
        , env: {'NODE_ENV': 'development'}
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
