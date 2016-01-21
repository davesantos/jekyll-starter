var gulp      = require('gulp'),
    browserSync = require('browser-sync'),
    changed   = require('gulp-changed'),
    cp        = require('child_process'),
    gutil     = require('gulp-util'),
    jade = require('gulp-jade'),
    prettify  = require('gulp-prettify'),
    sass      = require('gulp-sass');

var paths = {
  build:    '_site',
  css:      '_site/css',
  images:   ['assets/**/*.jpg'],
  jade:     '_jade',
  sass:     ['_sass'],
  scripts:  ['js/*.js'],
  svgs:     'assets/svg/*.svg'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
  gutil.beep();
}

var gulp      = require('gulp'),
    browserSync = require('browser-sync'),
    changed   = require('gulp-changed'),
    cp        = require('child_process'),
    gutil     = require('gulp-util'),
    jade = require('gulp-jade'),
    prettify  = require('gulp-prettify'),
    sass      = require('gulp-sass');

var paths = {
  build:    '_site',
  css:      '_site/css',
  images:   ['assets/**/*.jpg'],
  jade:     '_jade',
  sass:     ['_sass'],
  scripts:  ['js/*.js'],
  svgs:     'assets/svg/*.svg'
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

gulp.task('jade', function(){
  gulp.src(paths.jade + '/**/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('.'))
    .pipe(browserSync.reload({stream:true}))
})

gulp.task('sass', function () {
  return gulp.src(paths.sass + '/**/*.{scss,sass}')
    .pipe(sass({
      includePaths: [paths.sass] }).on('error', errorHandler))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('css'));
});

gulp.task('js', function() {
  return gulp.src(paths.scripts)
    .pipe(gulp.dest(paths.build + '/js'))
    .pipe(browserSync.reload({stream:true}));
})

gulp.task('indent', function(){
  gulp.src([ paths.build + '/**/*.html' ])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: true,
      indent_size: 4
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('serve', ['sass', 'js', 'jade', 'jekyll-build'], function() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
  gulp.watch( paths.sass + '/**/*.{scss,sass}', ['sass']);
  gulp.watch( paths.scripts , ['js']);
  gulp.watch( paths.jade + '/**/*.jade', ['jade']);
  gulp.watch( './**/*.{html,yml}', ['jekyll-rebuild']);
})

gulp.task('default', ['serve']);