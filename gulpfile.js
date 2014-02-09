var gulp      = require( 'gulp' );
var clean     = require( 'gulp-clean' );
var compass   = require( 'gulp-compass' );
var imagemin  = require( 'gulp-imagemin' );
var jshint    = require( 'gulp-jshint' );
var minifycss = require( 'gulp-minify-css' );
var rename    = require( 'gulp-rename' );
var ssh       = require( 'gulp-ssh' );
var uglify    = require( 'gulp-uglify' );
var zip       = require( 'gulp-zip' );



var dirs = {
	js: '../assets/js',
	sass: '../assets/sass',
	images: '../assets/images',
	fonts: '../assets/fonts',
	core: '../core',
	tmp: 'tmp'
};



gulp.task( 'jshint', function() {
	gulp.src( dirs.js )
	.pipe( jshint() )
	.pipe( jshint.reporter( 'default' ) );
});



gulp.task( 'uglify', function() {
	gulp.src([
		'<%= dirs.js %>/libs/*.js', // External libs/plugins
		'<%= dirs.js %>/main.js'    // Custom JavaScript
	])
	.pipe( uglify() )
	.pipe( gulp.dest( dirs.js + '/main.min.js' ) );
});



gulp.task( 'uglify-bootstrap', function() {
	gulp.src([
		dirs.js + '/bootstrap/transition.js',
		dirs.js + '/bootstrap/alert.js',
		dirs.js + '/bootstrap/button.js',
		dirs.js + '/bootstrap/carousel.js',
		dirs.js + '/bootstrap/collapse.js',
		dirs.js + '/bootstrap/dropdown.js',
		dirs.js + '/bootstrap/modal.js',
		dirs.js + '/bootstrap/tooltip.js',
		dirs.js + '/bootstrap/popover.js',
		dirs.js + '/bootstrap/scrollspy.js',
		dirs.js + '/bootstrap/tab.js',
		dirs.js + '/bootstrap/affix.js'
	])
	.pipe( uglify() )
	.pipe( gulp.dest( dirs.js + '/libs/bootstrap.min.js' ) );
});



gulp.task( 'compass', function() {

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
gulp.task( 'r', [ 'rsync' ] );
gulp.task( 'c', [ 'compress' ] );
