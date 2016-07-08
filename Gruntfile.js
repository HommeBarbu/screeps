require('dotenv').config();

module.exports = function(grunt) {

    grunt.initConfig({
        screeps: {
            options: {
                email: process.env.USER,
                password: process.env.PASS,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['dist/*']
            }
        },
        ts: {
            default: {
                tsconfig: true
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-screeps');

    grunt.registerTask('default', ['ts', 'screeps']);
};
