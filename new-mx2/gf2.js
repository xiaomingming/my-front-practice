module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                strict: false, //当前作用域严格模式
                quotmark: 'single', //只能使用单引号
                undef: true,
                unused: 'vars', //形参和变量未使用检查
                noempty: true, //不允许使用空语句块{}
                latedef: true, //先定义变量，后使用
                forin: true, //for in hasOwnPropery检查
                eqeqeq: true, //!==和===检查
                curly: false, //值为true时，不能省略循环和条件语句后的大括号
                globals: {
                    'window': true,
                    'jQuery': true,
                    '$': true,
                    'global': true,
                    'document': true,
                    'console': true,
                    'setTimeout': true,
                    'setInterval': true,
                    'alert': true,
                    '$_conf': true,
                    'checkObj': true,
                    'utils_userStatus': true
                }
            },
            dist: {
                src: ['./dev/js/*.js']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: './dev/js/**/*.js',
                dest: './official/js/all.min.js'
            }
        },
        less: {
            dist: {
                options: {
                    paths: './dev/styles/',
                    sourceMap: true,
                    sourceMapFilename: 'lala.map'
                },
                files: [{
                    expand: true,
                    cwd: './dev/styles/app/',
                    src: ['*.less'],
                    dest: './dev/styles/app/',
                    ext: '.css'
                }, {
                    expand: true,
                    cwd: './dev/styles/less/',
                    src: ['*.less'],
                    dest: './dev/styles/css/',
                    ext: '.css'
                }]
            }
        },
        csscomb: {
            options: {
                config: './dev/styles/less/csscomb.json'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: './dev/styles/css/',
                    src: ['*.css'],
                    dest: './dev/styles/css/',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            build: {
                expand: true,
                cwd: './dev/styles/app/',
                src: '*.css',
                dest: './dev/styles/app/',
                ext: '.min.css'
            }
        },
        imagemin: {
            /* 压缩图片大小 */
            dist: {
                options: {
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    cwd: './dev/images/',
                    src: ['**/*.{jpg,png,gif}'],
                    dest: './official/images/'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-csscomb'); // css属性指定
    grunt.loadNpmTasks('grunt-contrib-concat'); //文件合并
    grunt.loadNpmTasks('grunt-contrib-jshint'); //js检查
    grunt.loadNpmTasks('grunt-contrib-less'); // scss
    grunt.loadNpmTasks('grunt-contrib-uglify'); //文件混淆
    grunt.loadNpmTasks('grunt-contrib-cssmin'); //css压缩
    grunt.loadNpmTasks('grunt-contrib-htmlmin'); //html压缩
    grunt.loadNpmTasks('grunt-contrib-imagemin'); //图像压缩
    grunt.loadNpmTasks('grunt-contrib-requirejs'); //requirejs优化


    // 注册任务
    grunt.registerTask('default', ['uglify', 'less', 'csscomb', 'cssmin', 'imagemin', 'jshint']);
};