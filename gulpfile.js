var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
// js
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// images
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
//styles
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var frontnote = require('gulp-frontnote');
var csslint = require('gulp-csslint');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');
//pug
var pug = require('gulp-pug');
// browserSync / Notify
var browserSync = require('browser-sync').create();
var notify = require('gulp-notify');
require('es6-promise').polyfill();
gulp.task('browser-sync', function() {
    browserSync.init(['/assets/styles/', '/assets/js/'], {
		server: {
			baseDir: './dist/',
      port: 9000
		}
	});
});

gulp.task('bs-reload', function () {
browserSync.reload();
});
//------------------------------------------------------------
//      Images
//-----------------------------------------------------------

gulp.task('images',function(){
    gulp.src(['src/assets/images/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.stream())

});
//------------------------------------------------------------
//      copy
//-----------------------------------------------------------
gulp.task('copy',function(){
    gulp.src(['src/bower_components/bootstrap/dist/js/bootstrap.js', 'src/bower_components/popper.js/dist/popper.min.js','src/bower_components/jquery/dist/jquery.js','node_modules/pnotify/dist/iife/PNotify.js'])
        .pipe(gulp.dest('dist/assets/scripts'))
        .pipe(browserSync.stream())

});
gulp.task('copyFonts',function(){
    gulp.src(['src/assets/fonts/*'])
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(browserSync.stream())

});
//------------------------------------------------------------
//      SASS
//-----------------------------------------------------------
gulp.task('sass', function(){
gulp.src(['src/assets/sass/**/*.sass','src/assets/sass/**/*.scss'])
.pipe(plumber({
  errorHandler: function (error) {
    console.log(error.message);
    this.emit('end');
}}))
// .pipe(frontnote({
//     out: 'docs/css'
// }))
.pipe(sourcemaps.init())
.pipe(sass())
.pipe(autoprefixer())
//.pipe(cssComb())
.pipe(cmq({log:true}))
//.pipe(csslint())
//.pipe(csslint.reporter())
//.pipe(concat('main.css'))
//.pipe(gulp.dest('dist/assets/styles/'))
//.pipe(rename({
//    suffix: '.min'
//}))
.pipe(cleanCss())
//.pipe(sourcemaps.write())
.pipe(gulp.dest('dist/assets/styles/'))
.pipe(browserSync.reload({stream:true}))

});
//------------------------------------------------------------
//      js
//-----------------------------------------------------------
gulp.task('scripts', function(){
return gulp.src('src/assets/js/**/*.js')
.pipe(plumber({
  errorHandler: function (error) {
    console.log(error.message);
    this.emit('end');
}}))
.pipe(gulp.dest('dist/assets/scripts/'))
.pipe(concat('main.js'))
.pipe(gulp.dest('dist/assets/scripts/'))
.pipe(rename({suffix: '.min'}))
.pipe(uglify())
.pipe(gulp.dest('dist/assets/scripts/'))
.pipe(browserSync.reload({stream:true}))
});
//------------------------------------------------------------
//      PUG
//-----------------------------------------------------------
gulp.task('pug',function(){
gulp.src(['src/template/pages/*.pug'])
    /*.pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))*/
    .pipe(pug())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('watch', ['browser-sync'], function(){
    gulp.watch(["src/assets/sass/**/*.sass", "src/assets/sass/**/*.scss"], ['sass']).on('change', browserSync.reload);
gulp.watch("src/assets/js/**/*.js", ['scripts']).on('change', browserSync.reload);
gulp.watch("src/template/**/*.pug", ['pug']);
gulp.watch("src/assets/images/*.*", ['images']);
//gulp.watch("dist/*.html", ['bs-reload']);
});

// Default task
gulp.task('default', ['sass', 'pug', 'scripts', 'images','copy','copyFonts', 'watch', 'browser-sync']);
