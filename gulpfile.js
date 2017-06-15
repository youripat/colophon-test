'use strict';

var gulp = require('gulp'),
	prefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	nunjucks = require('gulp-nunjucks'),
	plumber = require('gulp-plumber'),
	streamify = require("gulp-streamify"),
	runSequence = require('run-sequence'),
	notify = require('gulp-notify'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync'),
	browserify = require('browserify'),
	gutil = require('gulp-util'),
	tap = require('gulp-tap'),
	domain = require('domain'),
	ext_replace = require('gulp-ext-replace'),
	reload = browserSync.reload;

var config = require('./package.json');

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		style: 'build/css/',
		img: 'build/img/'
	},
	watch: {
		html: ['src/templates/**/*.twig'],
		js: ['src/js/**/*.js'],
		style: ['src/scss/**/*.scss'],
		img: ['src/img/**/*.*']
	},
	src: {
		html: ['src/templates/*.twig'],
		js: ['src/js/main.js'],
		style: ['src/scss/main.scss'],
		img: ['src/img/**/*.*']
	},
	clean: 'build/'
};

var onError = function (err) {
	notify.onError({
		title: "Gulp error in " + err.plugin,
		message: err.message
	})(err);
	this.emit('end');
};

gulp.task('webserver', function () {
	browserSync({server: "./build"});
});

gulp.task('clean', function (cb) {
	return rimraf(path.clean, cb);
});

gulp.task('build:html', function () {
	return gulp.src(path.src.html)
		.pipe(plumber({errorHandler: onError}))
		.pipe(nunjucks.compile())
        .pipe(ext_replace('.html', '.twig'))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('build:style', function (cb) {
	return gulp.src(path.src.style)
		.pipe(plumber({errorHandler: onError}))
		.pipe(sass({includePaths: './' + config.sassIncludePath}))
		.pipe(prefixer({browsers: ['last 10 versions']}))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});

gulp.task('build:js', function () {


	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(tap(
			function (file) {
				var d = require('domain').create();
				d.on("error",
					function (err) {
						gutil.log(gutil.colors.red("Browserify compile error:"), err.message, "\n\t", gutil.colors.cyan("in file"), file.path);
						gutil.beep();
					}
				);

				d.run(function () {
					file.contents = browserify({
						entries: [path.src.js],
					}).bundle();
				});
			}
		))
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));


	// gulp.src(path.src.js, {read: false})
	// 	.pipe(tap(function (file) {
	// 		var d = domain.create();
	//
	// 		d.on("error", function (err) {
	// 			gutil.log(
	// 				gutil.colors.red("Browserify compile error:"),
	// 				err.message,
	// 				"\n\t",
	// 				gutil.colors.cyan("in file"),
	// 				file.path
	// 			);
	// 		});
	//
	// 		d.run(function () {
	// 			file.contents = browserify({
	// 				entries: [path.src.js]
	// 			}).bundle();
	// 		});
	// 	}))
	// 	.pipe(streamify(concat('main.js')))
	// 	.pipe(plumber({errorHandler: onError}))
	// 	.pipe(gulp.dest(path.build.js))
	// 	.pipe(reload({stream: true}));

});

gulp.task('build:img', function () {
	return gulp.src(path.src.img)
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulp.dest(path.build.img));
});

gulp.task('build', [
	'build:html',
	'build:style',
	'build:js',
	'build:img'
]);

gulp.task('watch', function () {
	watch(path.watch.html, function (event, cb) {
		gulp.start('build:html');
	});
	watch(path.watch.style, function (event, cb) {
		gulp.start('build:style');
	});
	watch(path.watch.js, function (event, cb) {
		gulp.start('build:js');
	});
	watch(path.watch.img, function (event, cb) {
		gulp.start('build:img');
	});
});

gulp.task('default', function (cb) {
	runSequence('build', 'watch', 'webserver', cb);
});
