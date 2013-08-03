module.exports = function(grunt) {
  grunt.initConfig({
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    mochacov: {
      test: {
        options: {
          reporter: 'spec'
        }
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          output: 'coverage.html'
        }
      },
      travis: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      options: {
        files: ['test/*.js'],
        timeout: 5000,
        recursive: true,
        growl: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('coveralls', ['env:test', 'mochacov:travis']);
  grunt.registerTask('travis', ['env:test', 'mochacov:test']);
  grunt.registerTask('test', ['env:test', 'mochacov:test', 'mochacov:coverage']);
}