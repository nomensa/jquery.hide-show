'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Project configuration
    grunt.initConfig({

        // Minify files with UglifyJS
        uglify: {
            options: {
                preserveComments: 'some'
            },
            target: {
                files: {
                    'jquery.hideShow.min.js': ['jquery.hideShow.js']
                }
            }
        },

        // Grunt plugin for Karma
        karma: {
            all: {
                configFile: 'karma.conf.js'
            }
        },

        // Validate files with JSHint
        jshint: {
            options: {
                globals: {
                    '$': true,
                    'jQuery': true
                },
                jshintrc: '.jshintrc'
            },
            files: [
                'Gruntfile.js',
                'jquery.hideShow.js'
            ],
        },

        // Task for checking JavaScript Code Style with jscs
        jscs: {
            options: {
                config: '.jscsrc'
            },
            files: [
                'Gruntfile.js',
                'jquery.hideShow.js'
            ]
        },

        watch: {
            options: {
                debounceDelay: 250
            },
            js: {
                files: [
                    'jquery.hideShow.js',
                ],
                tasks: [
                    'uglify'
                ]
            },
            test: {
                files: [
                    'Gruntfile.js',
                    'jquery.hideShow.js',
                    'hideShowSpec.js'
                ],
                tasks: [
                    'karma',
                    'jshint',
                    'jscs'
                ]
            }
        },
        version: {
            options: {
                prefix: '@version:\\s+[\'"]'
            },
            src: [
                'jquery.hideShow.js',
                'jquery.hideShow.min.js'
            ]
        }
    });

    // Default tasks e.g. where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', 'watch');
    grunt.registerTask('test', ['jshint', 'jscs', 'karma']);
    grunt.registerTask('release', ['test', 'uglify', 'version']);
};