module.exports = function (grunt) {
  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    uglify: {
      build: {
        src: "js/index.js",
        dest: "js/index.min.js",
      },
    },
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: "images/src/", // read from src
            src: ["**/*.{png,jpg,jpeg,gif,svg}"],
            dest: "images/build/", // write to build
          },
        ],
      },
    },
    sass: {
      dist: {
        options: {
          implementation: require("sass"),
          style: "compressed",
        },
        files: {
          "css/build/style.css": "css/style.scss",
        },
      },
    },

    watch: {
      scripts: {
        files: ["js/**/*.js", "!js/**/*.min.js"], // يراقب كل JS ويستثني المضغوط
        tasks: ["uglify"],
        options: { spawn: false },
      },
      sass: {
        files: ["css/**/*.scss", "!css/build/**"],
        tasks: ["sass"],
        options: { spawn: false },
      },
      images: {
        files: ["images/src/**/*.{png,jpg,jpeg,gif,svg}"],
        tasks: ["newer:imagemin"], // only changed images
        options: { spawn: false },
      },
    },
  });

  // 3. Where we tell Grunt we plan to use this plug-in.

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-imagemin");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-sass");
  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask("default", ["sass", "uglify", "imagemin"]);
  grunt.registerTask("dev", ["default", "watch"]);
};
