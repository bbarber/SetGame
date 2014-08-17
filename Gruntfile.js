module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    shell: {
      options : {
        stdout: true
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: 'bower install'
      }
    },

    connect: {
      options: {
        base: 'public/'
      },
      webserver: {
        options: {
          port: 8888,
          keepalive: true
        }
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
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
      unit_auto: {
        configFile: './test/karma-unit.conf.js'
      },
      e2e: {
        configFile: './test/karma-e2e.conf.js',
        autoWatch: false,
        singleRun: true
      },
      e2e_auto: {
        configFile: './test/karma-e2e.conf.js'
      }
    },

    watch: {
      assets: {
        files: ['public/css/*.css','public/js/**/*.js'],
        tasks: ['concat']
      }
    },

    concat: {
      styles: {
        dest: './public/assets/app.css',
        src: [
          'bower_components/bootstrap.css/css/bootstrap.css',
          'public/css/flat.css',
          'public/css/progress.css',
          'public/css/site.css'
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        dest: './public/assets/app.js',
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-route/angular-resource.js',
          'public/js/lib/*.js',
          'public/js/app.js',
          'public/js/constants/*.js',
          'public/js/controllers/*.js',
          'public/js/directives/*.js',
          'public/js/services/*.js',
          'public/js/constants/*.js'
        ]
      }
    }
  });

  grunt.registerTask('test', ['connect:testserver','karma:unit', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);

  //installation-related
  grunt.registerTask('install', ['shell:npm_install','shell:bower_install']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['install', 'concat', 'connect:devserver', 'open:devserver', 'watch:assets']);

  //server daemon
  grunt.registerTask('serve', ['connect:webserver']);
};
