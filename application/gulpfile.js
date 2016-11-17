/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var phantom = require('gulp-phantom');
var jasmine = require('gulp-jasmine-phantom');


gulp.task('default', ['copy-html', 'copy-images', 'styles', 'lint', 'scripts'], function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('js/**/*.js', ['lint']);
	gulp.watch('/index.html', ['copy-html']);
	gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'styles',
	'lint',
	'scripts-dist'
]);

gulp.task('scripts', function() {
  gulp.src('./js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js/*.js'));
});

gulp.task('scripts-dist', function() {
	gulp.src('./js/main.js')
		.pipe(concat('./dist/'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js/*.js'));
});

gulp.task('copy-html', function() {
	gulp.src('./index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
	gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('lint', function () {
	return gulp.src(['js/**/*.js'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failOnError last.
		.pipe(eslint.failOnError());
});

// use browser-sync start --server --index index.html --files="dist/*.css"
 browserSync.init({
     server: "./"
 });
 browserSync.stream();

// phantom
gulp.task('phantom', function(){
  gulp.src("./phantom/*.js")
    .pipe(phantom({
      ext: json
    }))
    .pipe(gulp.dest("./data/"));
});


 //jasmine-phantom plugin

 gulp.task('tests', function () {
   gulp.src('tests/spec/extraSpec.js')
          .pipe(jasmine({
          	integration: true,
          	vendor: 'tests/spec/extraSpec.js'
          }));
});