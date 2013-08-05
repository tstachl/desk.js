module.exports = function(grunt) {
  grunt.initConfig({
    env: {
      test: {
        NODE_ENV: 'test',
        REPLAY: 'record',
        DEBUG: 'true'
      },
      travis: {
        NODE_ENV: 'test',
        REPLAY: 'replay',
        YOURPACKAGE_COVERAGE: '1'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'blanket'
        },
        src: ['test/*.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['env:test', 'mochaTest']);
  grunt.registerTask('travis', ['mochacov:unit', 'mochacov:coverage']);
  grunt.registerTask('coveralls', ['mochacov:coverage', 'mochacov:coveralls']);

  grunt.registerTask('cleanfixtures', '', function() {
    grunt.log.writeln('Currently running the "default" task.');
  });
}