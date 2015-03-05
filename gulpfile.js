var gulp        = require('gulp');
var gutil       = require('gulp-util');
var nodemon     = require('gulp-nodemon');
var notify      = require('gulp-notify');
var browserSync = require("browser-sync");
var dest = require('gulp-dest');
var rename = require('gulp-rename');

gulp.task('js', function() {
  return gulp.src('builds/development/js/**/*')
  .pipe(rename(function (path) {
        path.dirname += "/app/public/js";
        // console.log("path: ", path);
    }))
  .pipe(gulp.dest('./'))
  .pipe(notify({message: 'JS refreshed'}));
});

gulp.task('html', function() {
  return gulp.src('builds/development/views/*.html')
  .pipe(rename(function (path) {
        path.dirname += "/app/public/partials";
        // console.log("path: ", path);
    }))
  .pipe(gulp.dest('./'))
  // .pipe(browserSync.reload())
  .pipe(notify({message: 'Views refreshed'}));
});

gulp.task('css', function() {
  return gulp.src('builds/development/css/*.css')
  .pipe(notify({message: 'CSS refreshed'}));
});

gulp.task('watch', function() {
	gulp.watch('builds/development/js/**/*', ['js']);
	gulp.watch('builds/development/css/*.css', ['css']);
	gulp.watch(['builds/development/views/*.html'], ['html']);
});

gulp.task('nodemon', function(cb) {
  var nodemon = require('gulp-nodemon');

  // We use this `called` variable to make sure the callback is only executed once
  var called = false;
  return nodemon({
    script: 'server.js',
    watch: ['server.js','builds/development/views/*.html']
  })
  .on('start', function onStart() {
    if (!called) {
      cb();
    }
    called = true;
  })
  // .on('change', ['defaul'])
  .on('change', function onChange() {
    console.log("--------On Change")
    // Also reload the browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  })
  .on('restart', function onRestart() {
    console.log("--------On Restart")
    // Also reload the browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  });
});

// Make sure `nodemon` is started before running `browser-sync`.
gulp.task('browser-sync', ['js', 'nodemon'], function() {
  var port = process.env.PORT || 6000;//port when app is running
  browserSync.init({

    // All of the following files will be watched
    // files: ['public/**/*.*'],

    // Tells BrowserSync on where the express app is running
    proxy: 'http://localhost:' + port,

    // This port should be different from the express app port
    port: 4000,

    // Which browser should we launch?
    browser: ['google chrome']
  });
});

// use default task to launch BrowserSync and watch JS files
gulp.task('default', ['browser-sync'], function () {

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("js/*.js", ['js', browserSync.reload]);
    gulp.watch("builds/development/views/*.html", ['html', browserSync.reload]);
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'nodemon','browser-sync']);