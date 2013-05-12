function Display ( tpl, inner, color )
{   
    tpl = $(tpl);
	tpl.addClass('adfab-display-img');
    this._tpl = $('<div class="adfab-display"></div>');
    this._tpl.append(tpl);
    
    this._close = $('<div class="close">x</div>');
    this._tpl.append(this._close);
    
    this._tpl.css({
        top: $(window, document).scrollTop() + 'px'
    });
    $('body').append(this._tpl);
    
    this.drag = new Drag(this._tpl, 'adfab-display-img');
    
    this.bindEvents();
}
 
Display.prototype.bindEvents = function ()
{
    var _self = this;
    
    this._close.bind('click', function ()
    {
        _self.destroy();
    });
};

Display.prototype.destroy = function ()
{
    if(this.drag != null) {
        this.drag.destroy();
    }
    this._close.unbind('click');
    this._tpl.remove();
};