function Selection ( callback, inner, color )
{
    'use strict';
    
    this._inner = (inner != null) ? inner : false;
    this._color = (color != null) ? color : '#000';
    this._callback = callback;
    
    this._sel = '<div class="adfab-overlay-screenshot">';
    this._sel += '</div>';
    
    this._jQuerysel = jQuery(this._sel);
    
    this._selection = '<div class="adfab-overlay-screenshot-top adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._selection += '<div class="adfab-overlay-screenshot-right adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._selection += '<div class="adfab-overlay-screenshot-bottom adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._selection += '<div class="adfab-overlay-screenshot-left adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    
    this._jQueryselection = jQuery(this._selection);
    
    this._selectionInner = '<div class="adfab-overlay-screenshot-inner adfab-overlay" style="background-color: ' + this._color + ';"></div>';
    this._jQueryselectionInner = jQuery(this._selectionInner);
    
    this._start = '<div class="adfab-overlay-start" style="background-color: ' + this._color + ';"></div>';
    this._jQuerystart = jQuery(this._start);
    
    this._xLine = '<div class="adfab-overlay-line-x" style="background-color: ' + this._color + ';"></div>';
    this._jQueryxLine = jQuery(this._xLine);
    
    this._yLine = '<div class="adfab-overlay-line-y" style="background-color: ' + this._color + ';"></div>';
    this._jQueryyLine = jQuery(this._yLine);
    
    jQuery('body').append(this._jQuerysel);
    
    this._jQuerysel.prepend(this._jQueryxLine);
    this._jQuerysel.prepend(this._jQueryyLine);
    this._jQuerysel.prepend(this._jQuerystart);
    this._jQuerysel.prepend(this._jQueryselection);
    this._jQuerysel.prepend(this._jQueryselectionInner);
    
    if(this._inner) {
        jQuery('.adfab-overlay-screenshot-start').hide();
        jQuery('.adfab-overlay-screenshot-top').hide();
        jQuery('.adfab-overlay-screenshot-right').hide();
        jQuery('.adfab-overlay-screenshot-bottom').hide();
        jQuery('.adfab-overlay-screenshot-left').hide();
    }else {
        jQuery('.adfab-overlay-screenshot-inner').hide();
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
    
    jQuery(window).bind('mousedown', function (e)
    {
        if(!_isClicked) {
            e.preventDefault();
            
            jQuery(window).unbind('mousedown');
            _isClicked = true;
            
            _pos.startX = e.clientX;
            _pos.startY = e.clientY;
            
            if(_self._inner) {
                _self._jQueryselectionInner.show();
                
                jQuery('.adfab-overlay-screenshot-inner').css({
                    top: e.clientY + 'px',
                    left: e.clientX + 'px'
                });
            }else {
                _self._jQueryselection.show();
                
                jQuery('.adfab-overlay-screenshot-top').css({
                    height: e.clientY + 'px'
                });
            
                jQuery('.adfab-overlay-screenshot-left').css({
                    width: e.clientX + 'px'
                });
            }
            
            _self._jQuerystart.hide();
        
            return false;
        }
    });
    
    jQuery(window).bind('mousemove', function (e)
    {
        _self._jQueryyLine.css({
            top: e.clientY + 'px'
        });
        
        _self._jQueryxLine.css({
            left: e.clientX + 'px'
        });
            
        if(_self._inner) {
            jQuery('.adfab-overlay-screenshot-inner').css({
                width: (e.clientX - _pos.startX) + 'px',
                height: (e.clientY - _pos.startY) + 'px'
            });
        }else {
            
            jQuery('.adfab-overlay-screenshot-right').css({
                width: (jQuery(window).width() -  e.clientX) + 'px'
            });
            
            jQuery('.adfab-overlay-screenshot-bottom').css({
                height: (jQuery(window).height() - e.clientY) + 'px'
            });
        }
    });
    
    jQuery(window).bind('mouseup', function (e)
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
    
    this._jQuerysel.remove();
    this._jQueryxLine.remove();
    this._jQueryyLine.remove();
    this._jQuerystart.remove();
    this._jQueryselection.remove();
};