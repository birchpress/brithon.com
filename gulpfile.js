'use strict';

var gulp = require('gulp');
var gPlugins = require('gulp-load-plugins')();

var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var del = require('del');

var _ = require('lodash');

var bases = {
  repo: __dirname
};

var dirs = {
  src: path.join(bases.repo, 'src'),
  app: path.join(bases.repo, 'app'),
  wordpress: path.join(bases.repo, 'app', 'wordpress')
};

gulp.task('clean', function() {
  gPlugins.util.log('Removing ', dirs.app);
  del.sync([dirs.app]);
});

gulp.task('copy:config', function() {
  var srcDir = dirs.src;
  return gulp.src([
    'app.yaml', 'cron.yaml', 'php.ini'
  ], {
    cwd: srcDir,
    dot: true
  })
    .pipe(gulp.dest(dirs.app));
});

gulp.task('copy:wp', [], function() {
  var srcRoot = path.join(dirs.src, 'wp');

  return gulp.src('**/*',
    {
      cwd: srcRoot,
      dot: true
    })
    .pipe(gulp.dest(dirs.wordpress));
});

gulp.task('copy:wp-overridden', ['copy:wp'], function() {
  var srcRoot = path.join(dirs.src, 'wp-overridden');

  return gulp.src(['**/*',
    '!exports{,/**}'],
    {
      cwd: srcRoot,
      dot: true
    })
    .pipe(gulp.dest(dirs.wordpress));
});


gulp.task('bundle', ['clean', 'copy:config', 'copy:wp-overridden'], function() {});
