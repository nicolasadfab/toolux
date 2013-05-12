$(document).ready(function (e)
{
    var i = 0;
    $('li', '.slider').each(function (index, value)
    {
        $(this).attr('data-carousel', i);
        $('.slider-btn').append('<li data-carousel="' + i + '"></li>');
        i++;
    });
    $('.slider').width(i * 239);
    $('li', '.slider-btn').first().addClass('actif');
    
    $('li', '.slider-btn').bind('click', function (e)
    {
        $('li', '.slider-btn').removeClass('actif');
        $(this).addClass('actif');
        
        $('.slider').first().animate({
            marginLeft: '-' + parseInt($(this).attr("data-carousel") * 239) + 'px'
        });
    });
});