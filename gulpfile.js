'use strict'

var gulp      = require('gulp'),
    browserSync = require('browser-sync'),
    changed   = require('gulp-changed'),
    cp        = require('child_process'),
    gutil     = require('gulp-util'),
    prettify  = require('gulp-prettify'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    sass      = require('gulp-sass');

var paths = {
  build:    '_site',
  css:      'assets/css',
  images:   ['assets/**/*.jpg'],
  sass:     ['_sass'],
  scripts:  ['assets/js']
};

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
  gutil.beep();
}

gulp.task('jekyll-build', function (done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

// gulp.task('jade', function(){
//   gulp.src(paths.jade + '/**/*.jade')
//     .pipe(jade({
//       pretty: true
//     }))
//     .pipe(gulp.dest('.'))
//     .pipe(browserSync.reload({stream:true}))
// })

gulp.task('sass', function () {
  return gulp.src(paths.sass + '/**/*.{scss,sass}')
    .pipe(sass({
      includePaths: [paths.sass] }).on('error', errorHandler))
    .pipe(gulp.dest(paths.build + '/' + paths.css))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(paths.css));
});

gulp.task('js', function() {
  return gulp.src(paths.scripts + '/**/*.js')
    .pipe(gulp.dest(paths.build + '/' + paths.scripts))
    .pipe(browserSync.reload({stream:true}));
})

gulp.task('prettify', ['jekyll-rebuild'] , function(){
  gulp.src([ paths.build + '/**/*.html' ])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: false,
      indent_size: 2
    }))
    // .pipe(removeEmptyLines())
    .pipe(gulp.dest(paths.build));
});

gulp.task('serve', ['sass', 'js', 'jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
  gulp.watch( paths.sass + '/**/*', ['sass']);
  gulp.watch( paths.scripts + '/**/*', ['js']);
  gulp.watch( ['*.{html,yml}', '_includes/*', '_layouts/*', '_posts/*'], ['prettify']);
})

gulp.task('default', ['serve']);