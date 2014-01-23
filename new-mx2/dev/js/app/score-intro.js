require.config({
    baseUrl: 'js/',
    paths: {
        'jquery': 'libs/jquery-1.8.2',
        'scoreToRank': 'utils/scoreToRank'
    }
});
require(['jquery', 'scoreToRank'], function($, score) {
    $(function() {
        score.run({
            'rankWrap': $('#user-rank-bar'),
            'borderW': 2,
            'levelArr': [0, 50, 100, 150, 200, 300,
                600, 800, 1000, 1200, 1500,
                1800, 2400, 3000, 4000, 6000,
                7000, 8400, 9600, 10000, 12000,
                13000, 14000, 14500, 15000, 16000,
                17000, 20000, 26000, 32000, 35000
            ]
        });
    });
});