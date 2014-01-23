({
    appDir: "./",
    baseUrl: "js",
    dir: "../build",
    optimizeCss:'standard.keepComments.keepLines',
    paths: {
        'jquery':'libs/jquery-1.8.2',
        'easyDialog':'utils/easyDialog',
        'easySwitch':'utils/easySwitch',
        'easyValidator':'utils/easyValidator',
        'miniNotification':'utils/miniNotification',
        'scoreToRank':'utils/scoreToRank',
        'a':'app/score-intro',
        'b':'app/convert-center'
    },
    shim:{
        'easyDialog': ['jquery'],
        'easySwitch':['jquery'],
        'easyValidator':['jquery'],
        'miniNotification':['jquery']
    },
    modules: [{
        name: 'a'
    },{
        name: 'b'
    }]
})