// 路径配置
require.config({
    baseUrl: './js',
    paths: {
        'jquery': 'libs/jquery-1.8.2',
        'easyDialog': 'utils/easyDialog',
        'easySwitch': 'utils/easySwitch',
        'easyValidator': 'utils/easyValidator',
        'miniNotification': 'utils/miniNotification',
        'scoreToRank': 'utils/scoreToRank',
        'a': 'app/score-intro',
        'b': 'app/convert-center'
    }
});
// 非AMD模块配置
requirejs.config({
    baseUrl: 'js/',
    shim: {
        'easyDialog': ['jquery'],
        'easySwitch': ['jquery'],
        'easyValidator': ['jquery'],
        'miniNotification': ['jquery']
    }
});