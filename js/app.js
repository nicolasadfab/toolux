var App = App || (function ($)
{

    var Utils   = {}, // Your Toolbox
        Events  = {}, // Event-based Actions   
        App     = {}, // Your Global Logic and Initializer
        Public  = {}, // Your Public Functions
        Promise = null; // for promise pattern
        
    /**
     ************************************************************
     * Implémentation du pattern promise
     ************************************************************
     */
    Promise = function ()
    {
        this.pending = [];
    };
    
    Promise.prototype = {
        pending:null,
        /** fonction called by other with 2 method
         * @param success (function)
         * @param failure (function)
         * @return self (object) */
        then: function (success, failure)
        {
            this.pending = { resolve: success, reject: failure };
            return this;
        },
        /** never call this method, use then (success, failure)
         * @param value (object)
         * @return null */
        resolve: function (value)
        {
            this.pending.resolve(value);
        },
        /** never call this method, use then (success, failure)
         * @param value (object)
         * @return null */
        reject: function (error)
        {
            this.pending.reject(error);
        }
    };

    Utils = {
        settings: {
            debug: true,
            meta: {},
            init: function ()
            {
                $('meta[name^="app-"]').each(function ()
                {
                    Utils.settings.meta[ this.name.replace('app-','') ] = this.content;
                });
            }
        },
        cache: {
            window: window,
            document: document
        },
        home_url: function (path)
        {
            if(typeof path=="undefined"){
                path = '';
            }
            return Utils.settings.meta.homeURL+path+'/';            
        },
        log: function (what)
        {
            if (Utils.settings.debug) {
                console.log(what);
            }
        },
        cookies:
        {
            createCookie: function (name, value, days)
            {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    var expires = "; expires="+date.toGMTString();
                }
                else var expires = "";
                document.cookie = name+"="+value+expires+"; path=/";
            },
            
            readCookie: function  (name)
            {
                var nameEQ = name + "=",
                    ca = document.cookie.split(';'),
                    i, c;
                for(i = 0;i < ca.length;i++) {
                    c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1,c.length);
                        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            },
            
            eraseCookie: function  (name)
            {
                createCookie(name,"",-1);
            }
        }
    };
    var _log = Utils.log,
        _cookies = Utils.cookies;

    Events = {
        endpoints: {
            makeNote: function (e)
            {
                e.preventDefault();
                App.addNote($(this).attr('data-color'));
                return false;
            },
            makeScreenshot: function (e)
            {
                e.preventDefault();
                App.addScreenshot();
                return false;
            },
            makeRefresh: function (e)
            {
                e.preventDefault();
                App.addRefresh(($(".icon-refresh").attr('data-checked') == '1') ? 0 : 1);
                return false;
            },
            sliderThumbOpacity: function (percent)
            {
                $('img', '.adfab-display').css({
                    opacity: percent / 100
                });
            },
            makeHelp: function (e)
            {
                e.preventDefault();
                App.openHelp();
                return false;
            }
        },
        bindEvents: function ()
        {
            $('[data-event]').each(function ()
            {
                var $this = $(this),
                    method = $this.attr('data-method') || 'click',
                    name = $this.attr('data-event'),
                    bound = $this.attr('data-bound')=='true';
                if(typeof Events.endpoints[name] != 'undefined') {
                    if(!bound) {
                        $this.attr('data-bound', 'true');
                        $this.on(method, Events.endpoints[name]);
                    }
                }
            });
        },
        init: function ()
        {
            Events.bindEvents();
        },
        dragEvents: function ()
        {
            $(document).bind(RESET_COUNT, function (e)
            {
                App.resetCountNote();
            });
            
            // DRAG AND DROP
            $('body').on('dragenter dragover', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
            
                $('.tab-2').addClass('open');
            });
            
            $('body').on('dragend', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
            
                $('.tab-2').removeClass('open');
                $('#drop_zone').removeClass('over');
            });
            
            $('#drop_zone').on('dragout dragleave', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
            
                $('.tab-2').removeClass('open');
                $('#drop_zone').removeClass('over');
            });
            
            $('#drop_zone').on('dragover', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
                $('#drop_zone').addClass('over');
                e.originalEvent.dataTransfer.dropEffect = 'copy';
            });
            
            $('#drop_zone').on('drop', function (e)
            {
                e.stopPropagation();
                e.preventDefault();
            
                $('.tab-2').removeClass('open');
                $('#drop_zone').removeClass('over');

                var files = e.originalEvent.dataTransfer.files, // FileList object.
                    reader = new FileReader(),
                    output = [],
                    i;
                
                for (i = 0, f; f = files[i]; i++) {
                    reader.readAsDataURL( files[i] );
                }
                
                reader.onloadend = function( )
                {
                    var d = new Display('<img src="' + this.result + '" />');
                    $('img', '.adfab-display').css({
                        opacity: App.logic.thumbSlider.getPercent() / 100
                    });
                }
            });
        }
    };
    
    App = {
        logic: {
            firstTime:true,
            open:true,
            note: {
                red: [],
                yellow: [],
                green: [],
                blue: []
            },
            thumbSlider: null
        },
        
        init: function ()
        {
            App.start()
            .then(
                function ()
                {
                    Utils.settings.init();
                    Events.init();
                    Events.dragEvents();
                    App.open();
                    
                    App.logic.thumbSlider = new Slider($("#slider-1"), Events.endpoints.sliderThumbOpacity, 50);
                    App.addRefresh(_cookies.readCookie("css_refresh"));
                },
                App.error
            );
        },
        
        close: function ()
        {
            App.logic.open = false;
            $('#adfab-utils').addClass('close');
        },
        
        open: function ()
        {
            App.logic.open = true;
            $('#adfab-utils').removeClass('close');
        },
        
        start: function ()
        {
            var promise = new Promise();
            
            if(App.logic.firstTime) {
                App.load(chrome.extension.getURL("tabs.html"))
                    .then(
                        function (e)
                        {
                            App.appendTo(e);
                            promise.resolve();
                        },
                        App.error
                    );
            }else {
                if(App.logic.open) {
                    // close
                    App.close();
                }else {
                    App.open();
                    //promise.resolve();
                }
            }
            
            App.logic.firstTime = false;
            return promise;
        },
        
        appendTo: function (e)
        {
            var _body = document.getElementsByTagName('html')[0],
                _div = document.createElement('div');
                
            _div.innerHTML = e;
            _body.appendChild(_div);
        },
        
        load: function ( url )
        {
            var xhr = new XMLHttpRequest(),
                promise = new Promise();
                
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function ()
            {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        promise.resolve(xhr.responseText);
                    }else {
                        promise.reject(xhr.status);
                    }
                }else {
                    promise.reject(xhr.status);
                }
            };
            xhr.send(null);
            
            return promise;
        },
        
        error: function (e)
        {
            _log(e);
        },
        
        addNote: function (color)
        {
            for(var c in App.logic.note) {
                for(var n in App.logic.note[c]) {
                    _log(App.logic.note[c][n].isUsed());
                    if(!App.logic.note[c][n].isUsed()) {
                        App.logic.note[c][n].destroy();
                    }
                }
            }
            App.logic.note[color].push(new Note(color, App.logic.note[color].length + 1));
        },
        
        resetCountNote: function ()
        {
            for(var c in App.logic.note) {
                var i = 0;
                for(var n in App.logic.note[c]) {
                    if(App.logic.note[c][n].isDead()) {
                        App.logic.note[c].splice(i, 1);
                    }
                    i++;
                }
            }
            for(var c in App.logic.note) {
                var i = 1;
                for(var n in App.logic.note[c]) {
                    App.logic.note[c][n].setNumb(i);
                    i++;
                }
            }
            _log(App.logic.note);
        },
        
        openHelp: function ()
        {
            chrome.extension.sendRequest({
                msg: "help"
            });
        },
        
        addScreenshot: function ()
        {
            $("#adfab-utils").hide();
            var sel = new Selection(function (p)
            {
                chrome.extension.sendRequest({
                    msg: "screenFunc", pos: p
                });
            },
            false);
        },
        
        addRefresh: function (checked)
        {
            if(checked == null) {
                checked = ($(".icon-refresh").attr('data-checked') == 'true') ? 1 : 0;
            }
            if(checked == 1) {
                IS_ACTIF_CSS_REFRESH = true;
                $(".icon-refresh").addClass('actif');
                cssRefresh();
            }else {
                IS_ACTIF_CSS_REFRESH = false;
                $(".icon-refresh").removeClass('actif');
            }
            $(".icon-refresh").attr('data-checked', checked);
            _cookies.createCookie("css_refresh", checked);
        },
        
        // WILL SAVE AN IMAGE
        saveImg: function (img)
        {
            var link = $('<a href="' + img + '" download="screen-capture">test</a>');
            link[0].click();
            link.remove();

            $("#adfab-utils").show();
        }
    };
    
    Public = {
        init: App.init,
        saveImg: App.saveImg
    };

    return Public;

})(window.jQuery);

// EVERYTHING STTART HERE
jQuery(document).ready(function ()
{
    jQuery(window).bind(BROWSER_ACTION_CLICKED, function (e, data)
    {
        App.init();
    });
});

// CUSTOM EVENT STRING
var BROWSER_ACTION_CLICKED = "browser_action_clicked",
    RESET_COUNT = "reset_count";