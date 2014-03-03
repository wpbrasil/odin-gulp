module.exports = function gulpconfig() {
	'use strict';

	return {
		dirs : {
			js     : '../assets/js',
			sass   : '../assets/sass',
			css    : '../assets/css',
			images : '../assets/images',
			fonts  : '../assets/fonts',
			core   : '../core',
			tmp    : 'tmp',
			deploy : '../'
		},


		ftpConfig : {
			host : 'ftp.SEU-SITE.com',
			user : 'username',
			pass : '1234',
			remotePath : '/'
		},


		rsyncConfig : {
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
				src: gulpconfig().dirs.deploy,
				dest: 'user@host.com:~/PATH/wp-content/themes/odin'
			},

			production : {
				src: gulpconfig().dirs.deploy,
				dest: 'user@host.com:~/PATH/wp-content/themes/odin'
			}
		}
	};
};
