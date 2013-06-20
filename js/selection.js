function Selection ( callback, inner, color )
{
    'use strict';
    
    this._inner = (inner != null) ? inner : false;
    this._color = (color != null) ? color : '#000';
    this._callback = callback;
    
    this._sel = '<div class="adfab-overlay-screenshot">';
    this._sel += '</div>';
    
    this._$sel = $(this._sel);
    
    this._selection = '<div class="adfab-overlay-screenshot-top adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._selection += '<div class="adfab-overlay-screenshot-right adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._selection += '<div class="adfab-overlay-screenshot-bottom adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._selection += '<div class="adfab-overlay-screenshot-left adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    
    this._$selection = $(this._selection);
    
    this._selectionInner = '<div class="adfab-overlay-screenshot-inner adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._$selectionInner = $(this._selectionInner);
    
    this._start = '<div class="adfab-overlay-start" style="background-color: ' + this._color + ';"></div>';
    this._$start = $(this._start);
    
    this._xLine = '<div class="adfab-overlay-line-x" style="background-color: ' + this._color + ';"></div>';
    this._$xLine = $(this._xLine);
    
    this._yLine = '<div class="adfab-overlay-line-y" style="background-color: ' + this._color + ';"></div>';
    this._$yLine = $(this._yLine);
    
    $('body').append(this._$sel);
    
    this._$sel.prepend(this._$xLine);
    this._$sel.prepend(this._$yLine);
    this._$sel.prepend(this._$start);
    this._$sel.prepend(this._$selection);
    this._$sel.prepend(this._$selectionInner);
    
    if(this._inner) {
        $('.adfab-overlay-screenshot-start').hide();
        $('.adfab-overlay-screenshot-top').hide();
        $('.adfab-overlay-screenshot-right').hide();
        $('.adfab-overlay-screenshot-bottom').hide();
        $('.adfab-overlay-screenshot-left').hide();
    }else {
        $('.adfab-overlay-screenshot-inner').hide();
    }
	
    this.bindEvents();
}

// Note here that we are using Object.prototype.newMethod rather than // Object.prototype so as to avoid redefining the prototype object 
Selection.prototype.bindEvents = function ()
{
    'use strict';
    
    var _self = this,
        _isClicked = false,
        _pos = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        };
    
    $(window).bind('mousedown', function (e)
    {
        if(!_isClicked) {
            e.preventDefault();
            
            $(window).unbind('mousedown');
            _isClicked = true;
            
            _pos.startX = e.clientX;
            _pos.startY = e.clientY;
            
            if(_self._inner) {
                _self._$selectionInner.show();
                
                $('.adfab-overlay-screenshot-inner').css({
                    top: e.clientY + 'px',
                    left: e.clientX + 'px'
                });
            }else {
                _self._$selection.show();
                
                $('.adfab-overlay-screenshot-top').css({
                    height: e.clientY + 'px'
                });
            
                $('.adfab-overlay-screenshot-left').css({
                    width: e.clientX + 'px'
                });
            }
            
            _self._$start.hide();
        
            return false;
        }
    });
    
    $(window).bind('mousemove', function (e)
    {
        _self._$yLine.css({
            top: e.clientY + 'px'
        });
        
        _self._$xLine.css({
            left: e.clientX + 'px'
        });
            
        if(_self._inner) {
            $('.adfab-overlay-screenshot-inner').css({
                width: (e.clientX - _pos.startX) + 'px',
                height: (e.clientY - _pos.startY) + 'px'
            });
        }else {
            
            $('.adfab-overlay-screenshot-right').css({
                width: ($(window).width() -  e.clientX) + 'px'
            });
            
            $('.adfab-overlay-screenshot-bottom').css({
                height: ($(window).height() - e.clientY) + 'px'
            });
        }
    });
    
    $(window).bind('mouseup', function (e)
    {
        if(_isClicked) {
            e.preventDefault();
            
            _isClicked = false;
            
            _pos.endX = e.clientX;
            _pos.endY = e.clientY;
            
            _pos.width = _pos.endX - _pos.startX;
            _pos.height = _pos.endY - _pos.startY;
            
            if(_self._callback != null) {
                _self._callback(_pos);
            }
            
            _self.destroy();
            
            return false;
        }
    });
};

Selection.prototype.destroy = function ()
{
    'use strict';
    
    this._$sel.remove();
    this._$xLine.remove();
    this._$yLine.remove();
    this._$start.remove();
    this._$selection.remove();
};