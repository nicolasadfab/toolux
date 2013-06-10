function TooluxSlider (parent, callback, opacity)
{
	this.callback = callback;
	this.parent = parent;
	this.width = parent.width();
	
	this.container = $("<div class='slide-container'></div>");
	this.bar = $("<div class='slide-bar'></div>");
	this.btn = $("<div class='slide-btn'></div>");
	
	this.container.append(this.bar);
	this.container.append(this.btn);
	
	this.parent.append(this.container);
	
	this.bar.css({
		width: this.width
	});
	
	this.btn.css({
		left: this.width
	});
	
    this.setPercent(this.bar.offset().left + (opacity * this.bar.width() / 100), this.callback);
	this.bindEvents();
}

TooluxSlider.prototype.setPercent = function (pInt, callback)
{
    x = pInt - this.bar.offset().left;
    if(x < 0) {
        x = 0;
    }else if(x > this.width) {
        x = this.width;
    }
    
    this.btn.css({
        left: x + "px"
    }); 
    
    if(callback != null) {
        callback((x * 100 / this.width) + .1);
    }
}

// Note here that we are using Object.prototype.newMethod rather than // Object.prototype so as to avoid redefining the prototype object 
TooluxSlider.prototype.bindEvents = function ()
{
	var _self = this,
		isDragging = false,
		x = 0;
	
	this.btn.bind( "mousedown", function (e)
	{
		e.preventDefault();
		
		isDragging = true;
    
        $(document).bind( "mousemove", function (e)
        {
            if(isDragging) {
                e.preventDefault();
                _self.setPercent(e.clientX);
            }
        });
        
        $(document).bind( "mouseup", function (e)
        {
            if(isDragging) {
                $(document).unbind( "mousemove");
                $(document).unbind( "mouseup");
                e.preventDefault();
                isDragging = false;
                
                _self.setPercent(e.clientX, _self.callback);
            }
        });
		
		return false;
	});
};

TooluxSlider.prototype.getPercent = function ()
{
	return (parseInt(this.btn.css("left").replace("px", "")) * 100 / this.width) + .1;
};