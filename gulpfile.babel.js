"use strict";

import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import prettify from 'gulp-prettify';
import rmEmptyLines from 'gulp-remove-empty-lines';
import uglify from 'gulp-uglify';
import child_process from 'child_process';

const exec = child_process.exec;
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

const jekyllFiles = [
  '*.{html,yml,md}',
  '_posts/*.{markdown,md}',
  '_layouts/**/*.html',
  '_includes/**/*.html'
];

const messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

const errorHandler = (error) => {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
}

gulp.task('jekyll-build', (done) => {
  exec('bundle exec jekyll build', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('js', () => {
  return gulp.src(jsFiles)
    .pipe(gulp.dest(paths.build + '/' + paths.scripts))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('prettify', gulp.series('jekyll-build', () => {
  return gulp.src([paths.build + '/**/*.html'])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: false,
      indent_size: 2
    }))
    .pipe(rmEmptyLines())
    .pipe(gulp.dest(paths.build));
}));

gulp.task('minify', () => {
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

gulp.task('serve', gulp.series(gulp.parallel('js', 'minify','jekyll-build'), (done) => {

  browserSync.init({
    server: {
      baseDir: paths.build,
    },
    notify: false
  });

  gulp.watch(jekyllFiles).on('all', gulp.series('jekyll-build'));
  gulp.watch(sassFiles).on('change', gulp.series('jekyll-build'));
  gulp.watch(jsFiles).on('change', gulp.series('js'));
  gulp.watch(paths.build).on('all', browserSync.reload);
  return console.log('Initializing Server...'), done();

}));

gulp.task('travis', gulp.series(gulp.parallel('jekyll-build', 'js', 'prettify', 'minify'), (done) => {
  console.log('complete'), done();
}));

gulp.task('default', gulp.series('serve'));