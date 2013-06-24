jQuery(document).ready(function (e)
{
    var i = 0;
    jQuery('li', '.sliderAdfab').each(function (index, value)
    {
        jQuery(this).attr('data-carousel', i);
        jQuery('.sliderAdfab-btn').append('<li data-carousel="' + i + '"></li>');
        i++;
    });
    jQuery('.sliderAdfab').width(i * 300);
    jQuery('li', '.sliderAdfab-btn').first().addClass('actif');
    
    jQuery('li', '.sliderAdfab-btn').bind('click', function (e)
    {
        jQuery('li', '.sliderAdfab-btn').removeClass('actif');
        jQuery(this).addClass('actif');
        
        jQuery('.sliderAdfab').first().animate({
            marginLeft: '-' + parseInt(jQuery(this).attr("data-carousel") * 300) + 'px'
        });
    });
});