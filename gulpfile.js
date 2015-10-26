'use strict';

var gulp = require('gulp');
var gPlugins = require('gulp-load-plugins')();

var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var del = require('del');

var lazypipe = require('lazypipe');
var es = require('event-stream');
var _ = require('lodash');

var environments = [
  'dev',
  'prod',
  'local'
];

var bases = {
  repo: __dirname
};

var dirs = {
  src: path.join(bases.repo, 'src'),
  app: path.join(bases.repo, 'app'),
  wordpress: path.join(bases.repo, 'app', 'wordpress')
};

var taskConfig = {};

function shellWrapper(cmdTemplate, data) {
  var _data = data || {};

  return shell.exec(_.template(cmdTemplate)(_data));
}

function normalizeVersion(version) {
  // normalize the version for GAE.
  // '/' is allowed in branch and tag names, so escape it for path buidling.
  // we also escape bad chars for file name.
  return version.replace(/[\/\\:\.\?\*\|'"# ]/g, '-').toLowerCase();
}

function getVersion() {
  var res = shellWrapper('git name-rev --tags --name-only --no-undefined HEAD');

  if (res.code) {
    gPlugins.util.log(gPlugins.util.colors.yellow('[Warn]',
      'no tag attached to current HEAD, try to use commit# instead.'));

    res = shellWrapper('git rev-parse --short HEAD');
    if (res.code) {
      gPlugins.util.log(gPlugins.util.colors.red('[Error]',
        'get commit# failed,', res.output));
      process.exit(1);
    }
    taskConfig.version = ['v', gPlugins.util.date("UTC:yyyymmdd'T'HHMMss'Z'"), res.output.trim()].join('-');
  } else {
    taskConfig.version = res.output.trim();
  }

  taskConfig.version = normalizeVersion(taskConfig.version);
}

function configFilter() {
  return lazypipe().pipe(function() {
    return gPlugins.if('app.yaml',
      gPlugins.template(taskConfig));
  })();
}

gulp.task('default', function() {
  fs.readFile('README.md', 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    console.log(data);
  });
});

gulp.task('sanitycheck', function() {
  // supress shell command output
  shell.config.silent = true;

  _.assign(taskConfig, {
    environment: (gPlugins.util.env.environment || 'local').toLowerCase()
  });

  if (!(_.includes(environments, taskConfig.environment))) {
    gPlugins.util.log(gPlugins.util.colors.red('[Error]',
      'unknown environment:',
      taskConfig.environment));
    process.exit(1);
  }
});

gulp.task('clean', function() {
  gPlugins.util.log('Removing', gPlugins.util.colors.blue(dirs.app));
  del.sync([dirs.app]);
});

gulp.task('get:version', ['sanitycheck', 'clean'], function() {
  getVersion();
});

gulp.task('copy:config', ['get:version'], function() {
  var srcDir = dirs.src;

  return gulp.src([
    'app.yaml', 'cron.yaml', 'php.ini'
  ], {
    cwd: srcDir
  })
    .pipe(configFilter())
    .pipe(gulp.dest(dirs.app));
});

gulp.task('copy:wp', ['copy:config'], function() {
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

  return gulp.src('**/*',
    {
      cwd: srcRoot,
      dot: true
    })
    .pipe(gulp.dest(dirs.wordpress));
});

gulp.task('build', ['copy:wp-overridden'], function() {});

gulp.task('deploy', ['build'], function() {
  if (taskConfig.environment === 'local') {
    gPlugins.util.log(gPlugins.util.colors.red('[Error]',
      'no need to deploy for local environment.'));
  } else {
    shellWrapper('appcfg.py update <%= app %>', dirs);
  }
});
