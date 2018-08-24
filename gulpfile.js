"use strict";

let gulp = require('gulp');
let browserSync = require('browser-sync');
let cleanCSS = require('gulp-clean-css');
let exec = require('child_process').exec
let prettify = require('gulp-prettify');
let rmEmptyLines = require('gulp-remove-empty-lines');
let sass = require('gulp-sass');
let uglify = require('gulp-uglify');

const paths = {
  build: '_site',
  css: 'css',
  sass: ['css'],
  scripts: ['js']
};

const sassFiles = [
  'css/**/*',
  '_sass/**/*'
]

const jsFiles = [
  'js/**/*.js'
]

const messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
}

gulp.task('jekyll-build', function(done) {
  exec('bundle exec jekyll build', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('js', function() {
  return gulp.src(jsFiles)
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

gulp.task('serve', gulp.series(gulp.parallel('js', 'minify','jekyll-build'), function(done) {

  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });

  gulp.watch(sassFiles).on('change', gulp.series('jekyll-build'));
  gulp.watch(jsFiles).on('change', gulp.series('js'));
  gulp.watch(['*.{html,yml,md,markdown}', '_posts/*.{html,yml,md,markdown}', '_layouts/*.{html,yml,md,markdown}', '_includes/**/*.{html,yml,md,markdown}']).on('all', gulp.series('jekyll-build'));
  gulp.watch(paths.build).on('all', browserSync.reload);
  return console.log('Initializing Server...'), done();

}));

gulp.task('travis', gulp.series(gulp.parallel('jekyll-build', 'js', 'prettify', 'minify'), function(done) {
  console.log('complete'), done();
}));

gulp.task('default', gulp.series('serve'));