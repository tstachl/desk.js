module.exports = function(grunt) {
  grunt.initConfig({
    env: {
      test: {
        NODE_ENV: 'test',
        REPLAY: 'record'
      },
      travis: {
        NODE_ENV: 'test'
      }
    },
    mochacov: {
      unit: {
        options: {
          reporter: 'spec'
        }
      },
      coverage: {
        options: {
          reporter: 'mocha-term-cov-reporter',
          coverage: true
        }
      },
      coveralls: {
        options: {
          coveralls: {
            serviceName: 'travis-ci'
          }
        }
      },
      options: {
        files: 'test/*.js',
        timeout: 5000,
        ui: 'bdd',
        colors: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('test', ['env:test', 'mochacov:unit', 'mochacov:coverage']);
  grunt.registerTask('travis', ['mochacov:unit', 'mochacov:coverage']);
  grunt.registerTask('coveralls', ['mochacov:coveralls'])
}