require(['jquery', 'scoreToRank'], function($, score) {
    $(function() {
        score.run({
            'rankWrap': $('#user-rank-bar'),
            'd':6,//20的倍数，设置6倍，这样每个条的长度为120,之所以是20，可以满足4和5的最小倍数
            'borderW': 2,
            'levelArr': [0, 300,
                1700,
                6930,
                20350,
                59840,
                135520
            ]
        });
    });
});