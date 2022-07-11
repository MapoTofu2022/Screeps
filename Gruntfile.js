let matchdep = require('matchdep');
let mergeFiles = require('./grunt-scripts/mergeFiles');

module.exports = function (grunt) {
	matchdep.filterAll(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
	mergeFiles(grunt);

	grunt.initConfig({
		screeps: {
			options: {
				email:    'ysh99226@gmail.com',
				password: '6326Mptf3267',
				branch:   'default',
				token:    '2a5f1cde-b731-423f-b5ff-26893502b4c5',
				ptr:      false,
			},
			dist:    {
				src: ['dist/*.js']
			}
		},

		copy:      {
			main: {
				expand:  true,
				flatten: true,
				filter:  'isFile',
				cwd:     'dist/',
				src:     '**',
				dest:    '/Users/mapotofu/Library/Application Support/Screeps/scripts/screeps.com/default'
			},
		},
	});

	grunt.registerTask('main', ['test', 'merge', 'write']);
	grunt.registerTask('sandbox', ['merge', 'write-private']);
	grunt.registerTask('merge', 'mergeFiles');
	grunt.registerTask('write', 'screeps');
	grunt.registerTask('write-private', 'copy');
};
