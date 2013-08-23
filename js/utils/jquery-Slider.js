var Slider = function(options) {
    this.container = options.container;
    this.interval = options.interval;
    this._timer = null;
    this._index = options.startIndex;
    this._items = this.container.find('li');
    this.initialize();
};
Slider.prototype = {
    constructor: Slider,
    // 获取上一个，或者下一个的轮播下标
    getIndex: function(index, direction) {
        var sliderItemsLength = this._items.length;
        if (direction === -1) {
            // 向前计算 previous index
            return (index === 0) ? (sliderItemsLength - 1) : (index - 1);
        } else if (direction === 1) {
            // 向后计算 next index
            return (index === sliderItemsLength - 1) ? 0 : (index + 1);
        }
    },
    // 轮播序号控制
    gotoIndex: function() {
        this._index++;
        if (this._index === this._items.length) {
            this._index = 0;
        }
    },
    // 轮播状态控制
    slide: function(index) {
        this.slideSequence(index);
    },
    // 核心代码，控制轮播顺序及显示
    slideSequence:function(index){
        var sliderItems = this._items,
            prevIndex = this.getIndex(index, -1),
            nextIndex = this.getIndex(index, 1);
        sliderItems.attr('class', '');
        // 显示当前图片,隐藏其它图片
        sliderItems.eq(index).addClass('current');
        // 将当前图片的下一张方向为left
        sliderItems.eq(prevIndex).addClass('left');
        // 上一张图片为right
        sliderItems.eq(nextIndex).addClass('right');
    },
    // 停止轮播，此函数暂时无用
    stopSlide: function() {
        var self = this;
        clearInterval(self._timer);
        self._timer = null;
    },
    // 自动轮播
    autoSlide: function() {
        var self = this;
        this._timer = setInterval(function() {
            self.slide(self._index);
            self.gotoIndex();
        }, self.interval);
    },
    eventBind: function() {
        var self=this;
        this.slideSequence(this._index);
        // 事件绑定
        this.container.on('click','li.right,li.left',function(e){
            e.preventDefault();
            self.stopSlide();
            self._index=$(this).index();
            self.slide(self._index);
        });
        this.container.on('mouseenter',function(){
            self.stopSlide();
        });
        this.container.on('mouseleave',function(){
            self.autoSlide();
        });
    },
    // 初始化
    initialize: function() {
        var self = this;
        this.eventBind();
        this.autoSlide(self._index);
    }
};