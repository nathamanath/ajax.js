module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        eqeqeq: true,
        eqnull: true,
        curly: true
      },
      files: ['ajax.js', 'test/spec/*.js']
    },
    uglify: {
      my_target: {
        files: {
          'ajax.min.js': 'ajax.js'
        }
      }
    },
    jsdoc: {
      dist: {
        src: 'ajax.js',
        options: {
          destination: 'doc'
        }
      }
    },
    watch: {
      scripts: {
        files: ['ajax.js', 'test/spec/*.js'],
        tasks: ['jsdoc', "uglify", "jshint"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
}

