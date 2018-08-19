"use strict";

const gulp = require('gulp');
const browserSync = require('browser-sync');
const cleanCSS = require('gulp-clean-css');
const exec = require('child_process').exec
const prettify = require('gulp-prettify');
const rmEmptyLines = require('gulp-remove-empty-lines');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');


const paths = {
  build: '_site',
  css: 'css',
  sass: ['css'],
  scripts: ['js']
};

const messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
}


gulp.task('jekyll-build', function(cb) {
  exec('bundle exec jekyll build', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function() {
  browserSync.reload();
}));

gulp.task('js', function() {
  return gulp.src(paths.scripts + '/**/*.js')
    .pipe(gulp.dest(paths.build + '/' + paths.scripts))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('prettify', gulp.series('jekyll-build', function() {
  return gulp.src([paths.build + '/**/*.html'])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: false,
      indent_size: 2
    }))
    .pipe(rmEmptyLines())
    .pipe(gulp.dest(paths.build));
}));

gulp.task('minify', function() {
  return gulp.src([paths.build + '/' + paths.css + '/*.css'])
    .pipe(
      cleanCSS({
        debug: true,
        keepBreaks: true,
        keepSpecialComments: false
      }, function(details) {
        console.log(details.name + ': ' + details.stats.originalSize + ' ==> ' + details.stats.minifiedSize);
      }))
    .pipe(gulp.dest(paths.build + '/' + paths.css))
});

gulp.task('serve', gulp.series(gulp.parallel('js', 'jekyll-build', 'minify'), function(done) {

  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });

  gulp.watch([paths.sass + '/**/*', '_sass/**/*'], gulp.parallel('jekyll-rebuild')).on('change', browserSync.reload);
  gulp.watch(paths.scripts + '/**/*', gulp.parallel('js')).on('change', browserSync.reload);
  gulp.watch(['**/*.{html,yml,md,markdown}'], gulp.parallel('jekyll-rebuild')).on('all', browserSync.reload);
  return console.log('Serve function ran'), done();

}));

gulp.task('travis', gulp.series(gulp.parallel('jekyll-build', 'js', 'prettify', 'minify'), function(done) {
  console.log('complete'), done();
}));

gulp.task('default', gulp.series('serve'));