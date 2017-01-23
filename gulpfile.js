'use strict';

var gulp      = require('gulp'),
    browserSync = require('browser-sync'),
    changed   = require('gulp-changed'),
<<<<<<< HEAD
    cp        = require('child_process'),
    gutil     = require('gulp-util'),
    prettify  = require('gulp-prettify'),
    removeEmptyLines = require('gulp-remove-empty-lines'),
    sass      = require('gulp-sass'),
    paths = {
      build:    '_site',
      css:      'assets/css',
      images:   ['assets/**/*.jpg'],
      sass:     ['_sass'],
      scripts:  ['assets/js']
    };
=======
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
>>>>>>> 69b8cd3781720e6d760b92a45edbb1ea6cef61ea

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
<<<<<<< HEAD
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

=======
}

gulp.task('jekyll-build', shell.task(['bundle exec jekyll build --incremental']));

gulp.task('jekyll-rebuild', ['jekyll-build', 'minify-css'], function() {
  browserSync.reload();
});

>>>>>>> 69b8cd3781720e6d760b92a45edbb1ea6cef61ea
gulp.task('js', function() {
  return gulp.src(paths.scripts + '/**/*.js')
    .pipe(gulp.dest(paths.build + '/' + paths.scripts))
    .pipe(browserSync.reload({stream:true}));
<<<<<<< HEAD
})

gulp.task('prettify', ['jekyll-rebuild'] , function(){
=======
});

gulp.task('prettify', ['jekyll-build'] , function(){
>>>>>>> 69b8cd3781720e6d760b92a45edbb1ea6cef61ea
  gulp.src([ paths.build + '/**/*.html' ])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: false,
      indent_size: 2
    }))
<<<<<<< HEAD
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
=======
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
  gulp.watch( [paths.sass + '/**/*', '_sass/**/*'], ['jekyll-rebuild']);
  gulp.watch( paths.scripts + '/**/*', ['js']);
  gulp.watch( ['*.{html,yml,md}', '_includes/*', '_layouts/*', '_posts/*'], ['prettify']);
>>>>>>> 69b8cd3781720e6d760b92a45edbb1ea6cef61ea
})

gulp.task('default', ['serve']);