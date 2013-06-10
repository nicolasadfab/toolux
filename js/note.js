function TooluxNote ( color, notif )
{    
    this._color = color;
    this._used = false;
    this._dead = false;
    this.drag = null;
    this.opacity = 5;
    this._pos = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        };
    
    this._tpl = $('<div />');
    this._tpl.attr('class', 'adfab-note ' + color);
    
    this._info = $('<div class="info">Scroll to change opacity</div>');
    this._tpl.append(this._info);
    
    this._notif = $('<div class="notif">' + notif + '</div>');
    this._tpl.append(this._notif);
    
    this._close = $('<div class="close">x</div>');
    this._tpl.append(this._close);
    
    this._textarea = $('<div class="textarea-wrapper"><div class="textarea-inner"><textarea></textarea></div></div>');
    this._tpl.append(this._textarea);
    
    this._textarea_show = $('<div class="textarea-show">+</div>');
    this._tpl.append(this._textarea_show);
    
    $('html').append(this._tpl);
    
    $('#adfab-utils-overlay').show();
    
    this.bindEvent();
}

TooluxNote.prototype.setNumb = function (i)
{
    this._notif.html(i);
}

TooluxNote.prototype.isDead = function ()
{
    return this._dead;
}

TooluxNote.prototype.isUsed = function ()
{
    return this._used;
}

TooluxNote.prototype.bindEvent = function (e)
{
    var _self = this,
        _isClicked = false,
        _pos = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0
        };
    
    $('#adfab-utils-overlay').bind('mousedown', function (e)
    {
        if(!_isClicked) {
            _self._tpl.show();
            _self._used = true;
            e.preventDefault();
            _isClicked = true;
            
            _pos.startX = e.clientX;
            _pos.startY = e.clientY + $(window, document).scrollTop();
            
            _self._tpl.css({
                top: _pos.startY + 'px',
                left: _pos.startX + 'px',
                display: 'block'
            });
    
            $(document).bind('mousemove', function (e)
            {
                _pos.width = e.clientX - _pos.startX;
                _pos.height = (e.clientY + $(window, document).scrollTop()) - _pos.startY;
                
                _self._tpl.css({
                    width: _pos.width + 'px',
                    height: _pos.height + 'px'
                });
            });
            
            $(document).bind('mouseup', function (e)
            {
                e.preventDefault();
                
                $('#adfab-utils-overlay').unbind('mousedown');
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');
                
                $('#adfab-utils-overlay').hide();
                
                _isClicked = false;
                
                _pos.endX = e.clientX;
                _pos.endY = e.clientY + $(window, document).scrollTop();
                    
                _pos.width = e.clientX - _pos.startX;
                _pos.height = (e.clientY + $(window, document).scrollTop()) - _pos.startY;
                
                _self._tpl.css({
                    width: _pos.width + 'px',
                    height: _pos.height + 'px'
                });
                
                _self._pos = _pos;
                
                _self.drag = new TooluxDrag(_self._tpl, 'adfab-note');
                return false;
            });
        
            return false;
        }
    });
    
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
    
    this._textarea_show.bind('click', function ()
    {
        if(!$(this).hasClass('open')) {
            _self._textarea.addClass('open');
            _self._textarea_show.addClass('open');
            _self._textarea_show.html('-');
        }else {
            _self._textarea.removeClass('open');
            _self._textarea_show.removeClass('open');
            _self._textarea_show.html('+');
        }
    });
    
    this._close.bind('click', function ()
    {
        _self.destroy();
    });
}

TooluxNote.prototype.opacityOverlay = function (i)
{
    if(i <= 10 && i >= 1) {
        this._tpl.css({
            background: 'rgba(255, 255, 255, ' + (i / 10) + ')'
        });
    }
    console.log('rgba(255, 255, 255, ' + (i / 10) + ')');
    if(this.opacity > 10) {
        this.opacity = 10;
    }else if(this.opacity < 0) {
        this.opacity = 0;
    }
}

TooluxNote.prototype.destroy = function (e)
{
    if(this.drag != null) {
        this.drag.destroy();
    }
    $('#adfab-utils-overlay').unbind('mousedown');
    this._tpl.unbind('scroll');
    $(document).unbind('mousemove');
    $(document).unbind('mouseup');
    this._close.unbind('click');
    
    this._tpl.remove();
    this._dead = true;
    $(document).trigger(RESET_COUNT);
}