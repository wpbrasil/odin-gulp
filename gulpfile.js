'use strict';

var gulp        = require( 'gulp' );
var clean       = require( 'gulp-clean' );
var compass     = require( 'gulp-compass' );
var plumber     = require( 'gulp-plumber' );
var imagemin    = require( 'gulp-imagemin' );
var jshint      = require( 'gulp-jshint' );
var minifycss   = require( 'gulp-minify-css' );
// var rename      = require( 'gulp-rename' );
var  gulpconcat = require( 'gulp-concat' );
var uglify      = require( 'gulp-uglify' );
var zip         = require( 'gulp-zip' );
var rsync       = require( 'rsyncwrapper' ).rsync;
var ftp         = require( 'gulp-ftp' );
var gulpconfig  = require( './gulpconfig' );
var pkg         = require( './package.json' );

require( 'colors' );



gulp.task( 'jshint', function() {
	var stream = gulp.src( [ gulpconfig.dirs.src_js + '/main.js' ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'default' ) );

	return stream;
});



gulp.task( 'uglify', [ 'jshint' ], function() {
	gulp.src([
		gulpconfig.dirs.src_js + '/libs/*.js', // External libs/plugins
		gulpconfig.dirs.src_js + '/main.js'    // Custom JavaScript
	])
	.pipe( gulpconcat( 'main.min.js' ) )
	.pipe( uglify() )
	.pipe( gulp.dest( gulpconfig.dirs.js ) );
});



gulp.task( 'uglify-bootstrap', function() {
	gulp.src([
		gulpconfig.dirs.src_js + '/bootstrap/transition.js',
		gulpconfig.dirs.src_js + '/bootstrap/alert.js',
		gulpconfig.dirs.src_js + '/bootstrap/button.js',
		gulpconfig.dirs.src_js + '/bootstrap/carousel.js',
		gulpconfig.dirs.src_js + '/bootstrap/collapse.js',
		gulpconfig.dirs.src_js + '/bootstrap/dropdown.js',
		gulpconfig.dirs.src_js + '/bootstrap/modal.js',
		gulpconfig.dirs.src_js + '/bootstrap/tooltip.js',
		gulpconfig.dirs.src_js + '/bootstrap/popover.js',
		gulpconfig.dirs.src_js + '/bootstrap/scrollspy.js',
		gulpconfig.dirs.src_js + '/bootstrap/tab.js',
		gulpconfig.dirs.src_js + '/bootstrap/affix.js'
	])
	.pipe( uglify() )
	.pipe( gulp.dest( gulpconfig.dirs.js + '/libs/bootstrap.min.js' ) );
});



gulp.task( 'compass', function() {
	var stream = gulp.src( gulpconfig.dirs.sass + '/**/*' )
		.pipe( plumber() )
		.pipe(
			compass({
				config_file : './config.rb',
				css : gulpconfig.dirs.css,
				sass: gulpconfig.dirs.sass
			})
		)
		.pipe( minifycss() )
		.pipe( gulp.dest( gulpconfig.dirs.css ) );

	return stream;
});



gulp.task( 'watch', function() {
	var watchers = [
		gulp.watch( gulpconfig.dirs.sass + '/**/*', [ 'compass' ] ),
		gulp.watch( gulpconfig.dirs.src_js + '/**/*.js', [ 'uglify' ] )
	];

	watchers.forEach(function( watcher ) {
		watcher.on( 'change', function( e ) {
			// Get just filename
			var filename = e.path.split( '/' ).pop();
			var bars = '\n================================================';

			console.log( ( bars + '\nFile ' + filename + ' was ' + e.type + ', runing tasks...' + bars ).toUpperCase() );
		});
	});
});



gulp.task( 'imagemin', function() {
	gulp.src( gulpconfig.dirs.images + '/**/*.{jpg, png, gif}' )
	.pipe(
		imagemin({
			optimizationLevel: 7,
			progressive: true
		})
	)
	.pipe( gulp.dest( gulpconfig.dirs.images ) );
});



gulp.task( 'rsync-staging', function() {
	var rsyncConfig = gulpconfig.rsyncConfig;
	rsyncConfig.options.src = rsyncConfig.staging.src;
	rsyncConfig.options.dest = rsyncConfig.staging.dest;

	return rsync(
		rsyncConfig.options,
		function( err, stdout, stderr, cmd ) {
			console.log( 'Shell command was:', cmd.cyan );

			if( err ) {
				return console.log( err.message.red );
			}

			console.log( 'Success!', stdout.grey );
		}
	);
});



gulp.task( 'rsync-production', function() {
	var rsyncConfig = gulpconfig.rsyncConfig;
	rsyncConfig.options.src = rsyncConfig.production.src;
	rsyncConfig.options.dest = rsyncConfig.production.dest;

	return rsync(
		rsyncConfig.options,
		function( err, stdout, stderr, cmd ) {
			console.log( 'Shell command was:', cmd.cyan );

			if( err ) {
				return console.log( err.message.red );
			}

			console.log( 'Success!', stdout.grey );
		}
	);
});



gulp.task( 'ftp-deploy', function() {
	var ftpConfig = gulpconfig.ftpConfig;

	gulp.src( gulpconfig.dirs.deploy )
	.pipe(
		ftp({
			host : ftpConfig.host,
			user : ftpConfig.user,
			pass : ftpConfig.password
		})
	);
});



gulp.task( 'zip', function() {
	var dirs = gulpconfig.dirs;

	gulp.src([
		'../**/*',
		'!../src/**/*',
		'!../**/*.md',
		'!' + dirs.sass + '/**/*',
		'!' + dirs.src_js + '/bootstrap/**/*',
		'!' + dirs.src_js + '/libs/**/*',
		'!' + dirs.src_js + '/main.js',
		'!../**/*.zip'
	])
	.pipe( zip( pkg.name + '.zip' ) )
	.pipe( gulp.dest( gulpconfig.dirs.deploy ) );
});



gulp.task( 'get-bootstrap', function() {
	var dirs = gulpconfig.dirs;

	gulp.src([
		dirs.tmp,
		dirs.sass + '/bootstrap/*',
		dirs.src_js + '/bootstrap/*',
		dirs.src_js + '/libs/bootstrap.min.js',
		dirs.fonts + '/bootstrap/*'
	], { read: false })
	.pipe( clean({ force: true }) );
});



/**
 * Execution Tasks
 */
gulp.task( 'default', [ 'jshint', 'compass', 'uglify' ] );
gulp.task( 'optimize', [ 'imagemin' ] );
gulp.task( 'ftp', [ 'ftp-deploy' ] );
gulp.task( 'compress', [ 'default', 'zip' ] );
gulp.task( 'bootstrap', [
	'get-bootstrap'
	// 'clean-prepare',
	// 'curl-bootstrap-sass',
	// 'unzip-bootstrap-scss',
	// 'rename-bootstrap-scss',
	// 'rename-bootstrap-js',
	// 'rename-bootstrap-fonts',
	// 'clean-bootstrap',
	// 'uglify-bootstrap',
	// 'compass'
]);



/**
 * Short aliases
 */
gulp.task( 'w', [ 'watch' ] );
gulp.task( 'o', [ 'optimize' ] );
gulp.task( 'f', [ 'ftp' ] );
gulp.task( 'rs', [ 'rsync-stage' ] );
gulp.task( 'rp', [ 'rsync-production' ] );
gulp.task( 'r', [ 'rsync-staging', 'rsync-production' ] );
gulp.task( 'c', [ 'compress' ] );
