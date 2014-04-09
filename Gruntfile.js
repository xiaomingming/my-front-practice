module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    trace: true,
                    style: 'compact', //nested, compact, compressed, expanded
                    precision: 4 //精度
                },
                files: [{
                    expand: true,
                    cwd: 'css/sass',
                    src: ['**/*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },
        csscomb: {
            options: {
                config: 'css/csscomb.json'
            },
            files: {
                expand: true,
                cwd: 'css/',
                src: ['**/*.css'],
                dest: 'css/',
                ext: '.css'
            }
        },
        watch: {
            sass: {
                files: 'css/sass/*.scss',
                tasks: ['sass']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-csscomb'); // css属性顺序指定
    grunt.loadNpmTasks('grunt-contrib-watch');


    // 注册任务
    grunt.registerTask('default', ['sass', 'csscomb']);
    grunt.registerTask('me', ['sass']);
};