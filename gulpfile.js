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
		.pipe( jshint() );
});

gulp.task( 'compass', function() {

});

gulp.task( 'uglify', function() {

});


gulp.task( 'default', [ 'jshint', 'compass', 'uglify' ] );
