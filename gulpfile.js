var
// node
path = require('path'),

// gulp plugins
gulp = require('gulp'),
gutil = require('gulp-util'),
spawn = require('gulp-spawn-shim'),
rename = require('gulp-rename'),
watch = require('gulp-watch'),
nodemon = require('gulp-nodemon'),
browserSync = require('browser-sync'),
Cache = require('gulp-file-cache');
useref = require('gulp-useref'),
filter = require('gulp-filter'),
uglify = require('gulp-uglify'),
minifyCss = require('gulp-clean-css'),
clean = require('gulp-clean'),
gulpSequence = require('gulp-sequence'),
debug = require('gulp-debug'),
open = require('gulp-open');

// document dirs config
var docs = "./content";
var dist = "./dist";

const jsFilter = filter('**/*.js', {restore: true});
const cssFilter = filter('**/*.css', {restore: true});
const BROWSER_SYNC_PORT = 5000;
const BROWSER_SYNC_RELOAD_DELAY = 3000;
const DEFAULT_CONTENT = "demo";
let cache = new Cache();

// pandoc tasks
var generatorTaskTemplate = function(templateFile, resultSuffix) {
    var opts = {};
    opts.cmd = 'pandoc';
    opts.args = [];
    opts.args.push('-s');
    opts.args.push('--template=' + path.join(__dirname, templateFile));

    var pandoc = function(file, opts, cb) {
        return cb(file, opts);
    };

    return gulp.src(path.join(docs, '*.md'))
      .pipe(spawn(opts, pandoc))
          .on('failure', console.log)
      .pipe(rename(function (path) {
          path.basename += resultSuffix;
          path.extname = ".html"
      }))
      .pipe(cache.filter()) //It won't stop Pandoc from running, but BrowserSync won't kick of unnecessarily
      .pipe(debug())
      .pipe(cache.cache())
      .pipe(gulp.dest(docs));
}

// generator tasks using pandoc
gulp.task('generate-internal-slides', function() {
  return generatorTaskTemplate('./template-internal-slides.html', '-internal-slides');
});

gulp.task('generate-internal-notes', function() {
  return generatorTaskTemplate('./template-internal-notes.html', '-internal-notes');
});

gulp.task('generate-public-slides', function() {
  return generatorTaskTemplate('./template-public-slides.html', '-public-slides');
});

gulp.task('generate-public-notes', function() {
  return generatorTaskTemplate('./template-public-notes.html', '-public-notes');
});

gulp.task('compile-md', ['generate-public-slides', 'generate-public-notes', 'generate-internal-slides', 'generate-internal-notes']);

// main task with watch and live reload
gulp.task('default', ['open', 'watch']);

// Open slides & notes browser
gulp.task('open', ['browser-sync'], function(){
  var options_slides = {
    uri: 'http://localhost:' + BROWSER_SYNC_PORT + '/' + DEFAULT_CONTENT + '-internal-slides.html',
    app: 'chrome'
  };
  var options_notes = {
    uri: 'http://localhost:' + BROWSER_SYNC_PORT + '/' + DEFAULT_CONTENT + '-internal-notes.html',
    app: 'chrome'
  };

  gulp.src('').pipe(open(options_slides)).pipe(open(options_notes));
});

// Nodemon
gulp.task('nodemon', ['compile-md'], function(cb) {
    let called = false;
    return nodemon({
        script: 'app.js',
        watch: 'app.js'
    }).on('start', () => {
        if (!called) {cb();}
        called = true;
    }).on('restart', () => {
        setTimeout(function() {browserSync.reload({stream: false});}, BROWSER_SYNC_RELOAD_DELAY);
    });
});

// Browser-Sync
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync({
        proxy: {
            target: 'http://localhost:8084',
            ws: true
        },
        open: false,
        port: BROWSER_SYNC_PORT
    });
});

// Watch
gulp.task('watch', function() {
    // watch md files + reload results when ready
    gulp.watch(path.join(docs, '*.md'), ['compile-md']);
    gulp.watch(path.join(docs, '*.html')).on('change', browserSync.reload);
    gulp.watch(path.join(docs, '/common/styles/*.css')).on('change', browserSync.reload);
});


// Dist
gulp.task('dist-clean', function() {
   return gulp.src(dist, {read: false})
      .pipe(clean()); 
});

gulp.task('dist-public-html', function() {
   //minification + using optimized files in *public* html files + dumping them to the output dir 
   return gulp.src([ path.join(docs, '*-public-slides.html'), path.join(docs, '*-public-notes.html') ])
      .pipe(useref())
      .pipe(jsFilter)
      .pipe(uglify())
      .pipe(jsFilter.restore)
      .pipe(cssFilter)
      .pipe(minifyCss())
      .pipe(cssFilter.restore)
      .pipe(debug())
      .pipe(gulp.dest(dist))
      .on('error', console.log);
});
 
gulp.task('dist-common-image-assets', function() {
   return gulp.src(path.join(docs, 'common/images/*.*'))
      .pipe(debug())
      .pipe(gulp.dest(path.join(dist, 'common/images')));
});

gulp.task('dist-common-font-assets', function() {
   return gulp.src(path.join(docs, 'common/fonts/*.*'))
      .pipe(debug())
      .pipe(gulp.dest(path.join(dist, 'common/fonts')));
});

//TODO: it doesn't copy subfolders 
gulp.task('dist-user-assets', function() {
   return gulp.src([path.join(docs, '/*/*'), '!' + path.join(docs, 'common/**/*')], { base: docs })
      .pipe(debug())
      .pipe(gulp.dest(dist));
});
  
gulp.task('dist', gulpSequence('generate-public-slides',
              'generate-public-notes',
              'dist-clean',
              'dist-public-html',
              'dist-common-image-assets',
              'dist-common-font-assets',
              'dist-user-assets'));