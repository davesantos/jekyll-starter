const gulp = require('gulp');
const browserSync = require('browser-sync');
const changed = require('gulp-changed');
const cleanCSS = require('gulp-clean-css');
const prettify = require('gulp-prettify');
const rmEmptyLines = require('gulp-remove-empty-lines');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const uglify = require('gulp-uglify');

var paths = {
  build: '_site',
  css: 'css',
  sass: ['css'],
  scripts: ['js']
};

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function errorHandler(error) {
  console.error(String(error));
  this.emit('end');
  browserSync.notify('Error');
}

gulp.task('travis', ['jekyll-build', 'js', 'prettify', 'minify'], function(){
  console.log('complete');
});

gulp.task('jekyll-build', shell.task('bundle exec jekyll build'));
gulp.task('greet', shell.task('echo Hello, World!'));

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

gulp.task('js', function() {
  return gulp.src(paths.scripts + '/**/*.js')
    .pipe(gulp.dest(paths.build + '/' + paths.scripts))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('prettify', ['jekyll-build'], function() {
  gulp.src([paths.build + '/**/*.html'])
    .pipe(prettify({
      indent_inner_html: true,
      indent_with_tabs: false,
      indent_size: 2
    }))
    .pipe(rmEmptyLines())
    .pipe(gulp.dest(paths.build));
});

gulp.task('minify', function() {
  return gulp.src([paths.build + '/' + paths.css + '/*.css'])
    .pipe(
      cleanCSS({
        debug: true,
        keepBreaks: true,
        keepSpecialComments: false
      }, function(details) {
        console.log(details.name + ': ' + details.stats.originalSize + ' --> ' + details.stats.minifiedSize);
      }))
    .pipe(gulp.dest(paths.build + '/' + paths.css))
});

gulp.task('serve', ['js', 'jekyll-build', 'minify'], function() {

  browserSync.init({ server: { baseDir: paths.build }});
  gulp.watch([paths.sass + '/**/*', '_sass/**/*'], ['jekyll-rebuild']);
  gulp.watch(paths.scripts + '/**/*', ['js']);
  gulp.watch(['**/*.{html,yml,md}'], ['jekyll-rebuild']);
})

gulp.task('default', ['serve']);