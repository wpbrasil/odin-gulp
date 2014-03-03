var gulpconfig = function() {
	'use strict';

	return {
		dirs : {
			js: '../assets/js',
			sass: '../assets/sass',
			css : '../assets/css',
			images: '../assets/images',
			fonts: '../assets/fonts',
			core: '../core',
			tmp: 'tmp'
		},


		rsync_config : {
			options : {
				args : [ '--verbose' ],
				exclude : [
					'**.DS_Store',
					'**Thumbs.db',
					'.editorconfig',
					'.git/',
					'.gitignore',
					'.jshintrc',
					'sass/',
					'src/',
					'README.md'
				],
				recursive : true,
				compareMode : 'checksum',
				syncDestIgnoreExcl : true
			},

			staging : {
				src: '../',
				dest: 'user@host.com:~/PATH/wp-content/themes/odin'
			},

			production : {
				src: '../',
				dest: 'user@host.com:~/PATH/wp-content/themes/odin'
			}
		}
	};
};

module.exports = gulpconfig;
