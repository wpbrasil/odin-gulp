(function() {

	'use strict';

	var gulp      = require( 'gulp' );
	var clean     = require( 'gulp-clean' );
	var compass   = require( 'gulp-compass' );
	var plumber   = require( 'gulp-plumber' );
	var imagemin  = require( 'gulp-imagemin' );
	var jshint    = require( 'gulp-jshint' );
	var minifycss = require( 'gulp-minify-css' );
	var rename    = require( 'gulp-rename' );
	var ssh       = require( 'gulp-ssh' );
	var uglify    = require( 'gulp-uglify' );
	var zip       = require( 'gulp-zip' );
	var rsync     = require( 'rsyncwrapper' ).rsync;
	var gulpconfig = require( './gulpconfig' )();

	require( 'colors' );



	gulp.task( 'jshint', function() {
		gulp.src( [ gulpconfig.dirs.js + '/**/*.js', './gulpfile.js' ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'default' ) );
	});



	gulp.task( 'uglify', function() {
		gulp.src([
			'<%= gulpconfig.dirs.js %>/libs/*.js', // External libs/plugins
			'<%= gulpconfig.dirs.js %>/main.js'    // Custom JavaScript
		])
		.pipe( uglify() )
		.pipe( gulp.dest( gulpconfig.dirs.js + '/main.min.js' ) );
	});



	gulp.task( 'uglify-bootstrap', function() {
		gulp.src([
			gulpconfig.dirs.js + '/bootstrap/transition.js',
			gulpconfig.dirs.js + '/bootstrap/alert.js',
			gulpconfig.dirs.js + '/bootstrap/button.js',
			gulpconfig.dirs.js + '/bootstrap/carousel.js',
			gulpconfig.dirs.js + '/bootstrap/collapse.js',
			gulpconfig.dirs.js + '/bootstrap/dropdown.js',
			gulpconfig.dirs.js + '/bootstrap/modal.js',
			gulpconfig.dirs.js + '/bootstrap/tooltip.js',
			gulpconfig.dirs.js + '/bootstrap/popover.js',
			gulpconfig.dirs.js + '/bootstrap/scrollspy.js',
			gulpconfig.dirs.js + '/bootstrap/tab.js',
			gulpconfig.dirs.js + '/bootstrap/affix.js'
		])
		.pipe( uglify() )
		.pipe( gulp.dest( gulpconfig.dirs.js + '/libs/bootstrap.min.js' ) );
	});



	gulp.task( 'compass', function() {
		gulp.src( gulpconfig.dirs.sass + './**/*.{sass, scss}' )
		.pipe( plumber() )
		.pipe(
			compass({
				config_file : './config.rb',
				css : 'stylesheets'
			})
		)
		.pipe( minifycss() )
		.pipe( gulp.dest( gulpconfig.dirs.css + '/style.css' ) );
	});



	gulp.task( 'watch', function() {
		var watchers = [
			gulp.watch( gulpconfig.dirs.sass + '/**/*.{sass, scss}', [ 'compass' ] ),
			gulp.watch( gulpconfig.dirs.js + '/**/*.js', [ 'jshint', 'uglify' ] )
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
		var rsync_config = gulpconfig.rsync_config;
		rsync_config.options.src = rsync_config.staging.src;
		rsync_config.options.dest = rsync_config.staging.dest;

		return rsync(
			rsync_config,
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
		var rsync_config = gulpconfig.rsync_config;
		rsync_config.options.src = rsync_config.production.src;
		rsync_config.options.dest = rsync_config.production.dest;

		return rsync(
			rsync_config,
			function( err, stdout, stderr, cmd ) {
				console.log( 'Shell command was:', cmd.cyan );

				if( err ) {
					return console.log( err.message.red );
				}

				console.log( 'Success!', stdout.grey );
			}
		);
	});



	/**
	 * Execution Tasks
	 */
	gulp.task( 'default', [ 'jshint', 'compass', 'uglify' ] );
	gulp.task( 'optimize', [ 'imagemin' ] );
	gulp.task( 'ftp', [ 'ftp-deploy' ] );
	gulp.task( 'compress', [ 'default', 'zip' ] );
	gulp.task( 'bootstrap', [
		'clean-prepare',
		'curl-bootstrap-sass',
		'unzip-bootstrap-scss',
		'rename-bootstrap-scss',
		'rename-bootstrap-js',
		'rename-bootstrap-fonts',
		'clean-bootstrap',
		'uglify-bootstrap',
		'compass'
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

})();
