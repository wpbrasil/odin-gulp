'use strict';

exports.dirs = {
	src_js : '../assets/_js',
	js     : '../assets/js',
	sass   : '../assets/sass',
	css    : '../assets/css',
	images : '../assets/images',
	fonts  : '../assets/fonts',
	core   : '../core',
	tmp    : 'tmp',
	deploy : '../'
};


exports.ftpConfig = {
	host : 'ftp.SEU-SITE.com',
	user : 'username',
	pass : '1234',
	remotePath : '/'
};


exports.rsyncConfig = {
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
		syncDestIgnoreExcl : true,
		onStdOut : function( data ) {
			console.log( data );
		}
	},

	staging : {
		src: exports.dirs.deploy,
		dest: 'user@host.com:~/PATH/wp-content/themes/odin'
	},

	production : {
		src: exports.dirs.deploy,
		dest: 'user@host.com:~/PATH/wp-content/themes/odin'
	}
};
