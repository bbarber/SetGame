module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.initConfig({
    shell: {
      options: {
        stdout: true
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: 'bower install'
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:3000'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e: {
        configFile: './test/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      },
      headless: {
        configFile: './test/karma-headless.conf.js',
        autoWatch: false,
        singleRun: true
      }
    },

    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'server.js',
          port: 3000
        }
      }
    },

    watch: {
      express: {
        files: ['server.js', 'api/**', 'auth/**', 'routes/**', 'views/**'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      assets: {
        files: ['public/**'],
        tasks: ['test:headless']
      },
      unittests: {
        files: ['test/unit/**/*.js'],
        tasks: ['test:headless']
      }
    }


  });

  grunt.registerTask('test', ['karma:unit', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['karma:e2e']);
  grunt.registerTask('test:headless', ['karma:headless']);

  //installation-related
  grunt.registerTask('install', ['shell:npm_install', 'shell:bower_install']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['install', 'express:dev', 'open:devserver', 'watch']);

};
