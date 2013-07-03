function TooluxArrow ( color, chara )
{
    'use strict';
    
    this._tpl = jQuery('<div class="adfab-arrow ' + color + '"><span class="info">Scroll to change opacity</span>' + chara + '</div>');
    
    this.opacity = 10;
    
    this._close = jQuery('<div class="close">x</div>');
    this._tpl.append(this._close);
    
    this._tpl.css({
        top: jQuery(window, document).scrollTop() + 'px'
    });
    jQuery('body').append(this._tpl);
     
    this.drag = new TooluxDrag(this._tpl, 'adfab-arrow');
    
    this.bindEvents();
}

TooluxArrow.prototype.bindEvents = function ()
{
    'use strict';
    
    var _self = this;
    
    this._tpl.bind('mousewheel', function (e)
    {
        e.preventDefault();
        if(e.originalEvent.wheelDelta / 120 > 0) {
            _self.opacityOverlay(_self.opacity++);
        }else {
            _self.opacityOverlay(_self.opacity--);
        }
        return false;
    });
    
    this._close.bind('click', function ()
    {
        _self.destroy();
    });
};

TooluxArrow.prototype.opacityOverlay = function (i)
{
    'use strict';
    
    if(i <= 10 && i >= 1) {
        this._tpl.css({
            opacity: (i / 10)
        });
    }
    
    if(this.opacity > 10) {
        this.opacity = 10;
    }else if(this.opacity < 0) {
        this.opacity = 0;
    }
};

TooluxArrow.prototype.destroy = function ()
{
    'use strict';
    
    if(this.drag !== null) {
        this.drag.destroy();
    }
    this._close.unbind('click');
    this._tpl.remove();
};