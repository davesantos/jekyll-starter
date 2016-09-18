'use strict';

var gulp      = require('gulp'),
    browserSync = require('browser-sync'),
    changed   = require('gulp-changed'),
    cleanCSS  = require('gulp-clean-css'),
    cp        = require('child_process'),
    prettify  = require('gulp-prettify'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    sass      = require('gulp-sass'),
    shell     = require('gulp-shell'),
    uglify    = require('gulp-uglify');

var paths = {
  build:    '_site',
  css:      'css',
  images:   ['assets/**/*.jpg'],
  sass:     ['css'],
  scripts:  ['assets/js']
};

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
}

gulp.task('jekyll-build', shell.task(['bundle exec jekyll build --incremental']));

gulp.task('jekyll-rebuild', ['jekyll-build', 'minify-css'], function() {
  browserSync.reload();
});

gulp.task('js', function() {
  return gulp.src(paths.scripts + '/**/*.js')
    .pipe(gulp.dest(paths.build + '/' + paths.scripts))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('prettify', ['jekyll-build'] , function(){
  gulp.src([ paths.build + '/**/*.html' ])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: false,
      indent_size: 2
    }))
    .pipe(removeEmptyLines())
    .pipe(gulp.dest(paths.build));
});

gulp.task('minify-css', function() {
  return gulp.src([ paths.build + '/' + paths.css + '/*.css'])
    .pipe(
      cleanCSS({
        debug: true,
        keepBreaks: true,
        keepSpecialComments: false
      }, function(details) {
        console.log(details.name + ': ' + details.stats.originalSize + ' --> ' + details.stats.minifiedSize);
      }
    ))
    .pipe(gulp.dest(paths.build + '/' + paths.css))
});

gulp.task('serve', ['js', 'jekyll-build', 'minify-css'],  function() {

  browserSync.init({ server: { baseDir: paths.build } });
  gulp.watch( [paths.sass + '/**/*', '_sass/*'], ['jekyll-rebuild']);
  gulp.watch( paths.scripts + '/**/*', ['js']);
  gulp.watch( ['*.{html,yml,md}', '_includes/*', '_layouts/*', '_posts/*'], ['prettify']);
})

gulp.task('default', ['serve']);