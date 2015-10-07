'use strict';

var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux32 = /^linux/.test(process.platform);
var isLinux64 = /^linux64/.test(process.platform);

var os = 'unknown';

if (isWin)
    os = 'win';
if (isMac)
    os = 'mac';
if (isLinux32)
    os = 'linux32';
if (isLinux64)
    os = 'linux64';

console.log('OS: ' + os);

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-electron');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');


  var userConfig = require('./build.config.js');

  var electronExec = '';
  if (isMac) {
    electronExec = 'open ./' + userConfig.cloudnode_package_dir + '/Cloudnode-darwin-x64/Cloudnode.app';
  }

  var electronDebug = '';
  if (isMac) {
    electronDebug = 'electron ./' + userConfig.compile_dir + '/';
  }


  var taskConfig = {

    /**
      * We read in our `package.json` file so we can access the package name and
      * version. It's already there, so we don't repeat ourselves here.
      */
    pkg: grunt.file.readJSON('./package.json'),

    /**
      * The banner is the comment that is placed at the top of our compiled
      * source files. It is first processed as a Grunt template, where the `<%=`
      * pairs are evaluated based on this very configuration object.
      */
    meta: {
      banner:
          '/**\n' +
          ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\'yyyy-mm-dd\') %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' *\n' +
          ' * Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author %>\n' +
          ' */\n'
    },

    /**
      * The `index` task compiles the `index.html` file as a Grunt template. CSS
      * and JS files co-exist here but they get split apart later.
      */
    index: {
      /**
        * During development, we don't want to have wait for compilation,
        * concatenation, minification, etc. So to avoid these steps, we simply
        * add all script files directly to the `<head>` of `index.html`. The
        * `src` property contains the list of included files.
      */
      build: {
        dir: '<%= build_dir %>',
        src: [
            '<%= vendor_files.special_js %>',
            '<%= vendor_files.js %>',
            '<%= build_dir %>/src/app/**/*.js',
            '<%= html2js.app.dest %>',
            '<%= vendor_files.css %>',
            '<%= build_dir %>/src/css/**/*.css'
        ]
      },

       /**
        * When it is time to have a completely compiled application, we can
        * alter the above to include only a single JavaScript and a single CSS
        * file. Now we're back!
        */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
            '<%= concat.compile_js.dest %>',
            '<%= concat.compile_css.dest %>'
        ]
      }
    },

    /**
      * The `copy` task just copies files from A to B. We use it here to copy
      * our project assets (images, fonts, etc.) and javascripts into
      * `build_dir`, and then to copy the assets to `compile_dir`.
      */
    copy: {
      build_app_assets: {
        files: [
            {
                src: [ '**' ],
                dest: '<%= build_dir %>/assets/images/',
                cwd: 'src/assets/images',
                expand: true
            }
        ]
      },
      build_vendor_assets: {
        files: [
            {
                src: [ '<%= vendor_files.assets %>' ],
                dest: '<%= build_dir %>/assets/',
                cwd: '.',
                expand: true,
                flatten: true
            }
        ]
      },
      build_vendor_fonts: {
        files: [
            {
                src: [ '<%= vendor_files.fonts %>' ],
                dest: '<%= build_dir %>/assets/webfonts/',
                cwd: '.',
                expand: true,
                flatten: true
            }
        ]
      },
      build_appjs: {
        files: [
            {
                src: [ '<%= app_files.js %>' ],
                dest: '<%= build_dir %>/',
                cwd: '.',
                expand: true
            }
        ]
      },
      build_appcss: {
        files: [
            {
                src: [ '<%= app_files.css %>' ],
                dest: '<%= build_dir %>/',
                cwd: '.',
                expand: true
            }
        ]
      },
      build_vendorjs: {
        files: [
            {
                src: [ '<%= vendor_files.js %>', '<%= vendor_files.special_js %>' ],
                dest: '<%= build_dir %>/',
                cwd: '.',
                expand: true
            }
        ]
      },
      build_vendorcss: {
        files: [
            {
                src: [ '<%= vendor_files.css %>' ],
                dest: '<%= build_dir %>/',
                cwd: '.',
                expand: true
            }
        ]
      },
      compile_assets: {
        files: [
            {
                src: [ '**' ],
                dest: '<%= compile_dir %>/assets',
                cwd: '<%= build_dir %>/assets',
                expand: true
            }
        ]
      },
      compile_package: {
        files: [
          {
            src: ['package.json'],
            dest: '<%= compile_dir%>',
            cwd: './src',
            expand: true
          }
        ]
      },
      compile_webkit_files: {
        src: ['webkit/**', 'node_modules/**'],
        dest: '<%= compile_dir%>/',
        cwd: './src/',
        expand:true
      },
      compile_codec_files: {
        files: [
          {
            src: ['**'],
            dest: 'cloudnode-app/osx64/cloudnode-app.app/Contents/Frameworks/nwjs Framework.framework/Libraries/',
            cwd: './src/codecs/',
            expand: true
          }
        ]
      }
    },


    /**
      * `grunt concat` concatenates multiple source files into a single file.
      */
    concat: {
      /**
        * The `build_css` target concatenates app CSS and vendor CSS
        * together.
        */
      compile_css: {
        options: {
            stripBanners: {
                block: true,
                line: true
            },
            banner: '<%= meta.banner %>'
        },
        src: [
            '<%= vendor_files.css %>',
            '<%= app_files.css %>'
        ],
        dest: '<%= compile_dir %>/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
      },

      /**
        * The `compile_js` target is the concatenation of our application source
        * code and all specified vendor source code into a single file.
        */
      compile_js: {
        options: {
            banner: '<%= meta.banner %>',
            separator: ';'
        },
        src: [
            '<%= vendor_files.js %>',
            '<%= html2js.app.dest %>',
            '<%= build_dir %>/src/app/**/*.js'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      },

      compile_jQuery: {
        options: {
          banner: '<%= meta.banner %>',
          separator: ';'
        },
        src: [
            '<%= vendor_files.special_js %>'
        ],
        dest: '<%= compile_dir %>/assets/jQuery.js'
      }
    },

    /**
      * Minify all javascript sources
      */
    uglify: {
      compile: {
          options: {
              sourceMap: true,
              banner: '<%= meta.banner %>'
          },
          files: {
              '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
          }
      }
    },

    /**
      * Minify all css sources
      */
    cssmin: {
      combine: {
          options: {
              keepSpecialComments: '0',
              banner: '<%= meta.banner %>'
          },
          files: {
              '<%= concat.compile_css.dest %>': '<%= concat.compile_css.dest %>'
          }
      }
    },

    /**
      * The directories to delete when `grunt clean` is executed.
      */
    clean: {
      options: {
          force: true
      },
      build: [ '<%= build_dir %>' ],
      compile: [ '<%= compile_dir %>' ]
    },

    /**
      * HTML2JS is a Grunt plugin that takes all of your template files and
      * places them into JavaScript files as strings that are added to
      * AngularJS's template cache. This means that the templates too become
      * part of the initial payload as one JavaScript file. Neat!
      */
    html2js: {
      options: {
          base: 'src/app'
      },
      /**
      * These are the templates from `src/views`.
      */
      app: {
          src: [ '<%= app_files.atpl %>' ],
          dest: '<%= build_dir %>/templates-app.js'
      }
    },

    /**
      * `jshint` defines the rules of our linter as well as which files we
      * should check. This file, all javascript sources, and all our unit tests
      * are linted based on the policies listed in `options`. But we can also
      * specify exclusionary patterns by prefixing them with an exclamation
      * point (!); this is useful when code comes from a third party but is
      * nonetheless inside `src/`.
      */
      jshint: {
        src: [
          '<%= app_files.js %>'
        ],
        gruntfile: [
          'Gruntfile.js'
        ],
        options: {
          jshintrc: '.jshintrc'
        },
        globals: {}
      },

      /**
        * `ng-min` annotates the sources before minifying. That is, it allows us
        * to code without the array syntax.
        */
      ngAnnotate: {
        options: {
          singleQuotes: true,
        },
        compile: {

          files: [
            {
                src: [ '<%= app_files.js %>' ],
                dest: '<%= build_dir %>',
                expand: true
            }
          ]
        }
      },

      electron: {
        osxBuild: {
            options: {
                name: 'Cloudnode',
                dir: '<%= compile_dir %>',
                out: '<%= cloudnode_package_dir %>',
                version: '0.33.0',
                platform: 'darwin',
                arch: 'x64',
                overwrite: true
            }
        }
      },

      shell: {
        run_full: {
          command: function() {
              return electronExec;
          },
          options: {
              stdout: true,
              stderr: true,
              stdin: true
          }
        },
        run_debug: {
          command: function() {
            return electronDebug;
          },
          options: {
              stdout: true,
              stderr: true,
              stdin: true
          }
        }
      },
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  grunt.registerTask('build', ['clean:build', 'html2js', 'jshint:src',
      'copy:build_app_assets', 'copy:build_vendor_assets', 'copy:build_vendorcss',
      'copy:build_vendor_fonts',
      'copy:build_appjs', 'copy:build_appcss', 'copy:build_vendorjs', 'index:build']);

  grunt.registerTask( 'compile', [
        'clean:compile', 'copy:compile_assets', 'copy:compile_package', 'copy:compile_webkit_files', 'ngAnnotate', 'concat:compile_js', 'concat:compile_jQuery', 'concat:compile_css', 'cssmin:combine', 'index:compile', 'uglify'
    ]);

  grunt.registerTask( 'quick_compile', [
        'clean:compile', 'copy:compile_assets', 'copy:compile_package', 'copy:compile_webkit_files', 'ngAnnotate', 'concat:compile_js', 'concat:compile_jQuery', 'concat:compile_css', 'cssmin:combine', 'index:compile'
    ]);

  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'connect:development', 'delta' ] );

  grunt.registerTask('default', ['build', 'quick_compile', 'electron', 'shell:run_full']);
  grunt.registerTask('debug', ['build', 'quick_compile', 'shell:run_debug']);

  grunt.registerTask('full_build', ['build', 'compile']);

  grunt.registerTask('run', ['default']);
  grunt.registerTask('install', ['build']);


  /**
    * The index.html template includes the stylesheet and javascript sources
    * based on dynamic names calculated in this Gruntfile. This task assembles
    * the list into variables for the template to use and then runs the
    * compilation.
  */
  grunt.registerMultiTask( 'index', 'Process index.html template', function () {
      var dirRE = new RegExp( '^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g' );

      var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
          return file.replace( dirRE, '' );
      });

      var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
          return file.replace( dirRE, '' );
      });

      grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
          process: function ( contents, path ) {
              return grunt.template.process( contents, {
                  data: {
                      scripts: jsFiles,
                      styles: cssFiles,
                      version: grunt.config( 'pkg.version' )
                  }
              });
          }
      });
  });

  /**
    * A utility function to get all app JavaScript sources.
    */
  function filterForJS ( files ) {
      return files.filter( function ( file ) {
          return file.match( /\.js$/ );
      });
  }

  /**
    * A utility function to get all app CSS sources.
    */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
        return file.match( /\.css$/ );
    });
  }
};
