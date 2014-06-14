
$.fn.verticalMiddle = function() {
    this.each(function(){
        var $this = $(this);
        var _height = $this.height();
        var _width = $this.width();
        var _parent_height = $this.parent().height();
        var _parent_width = $this.parent().width();
        
        $this.css({
            'position':'fixed'
        });
        $this.css('top',(_parent_height/2) - (_height/2));
        $this.css('left',(_parent_width/2) - (_width/2));
    });
    return this;
};