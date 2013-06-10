// FIRST CHECK VERSION
chrome.storage.sync.get('tooluxversion', function(v)
{
    'use strict';
    
    var details = chrome.app.getDetails();
    if(v.tooluxversion !== details.version) {
        chrome.storage.sync.set({'tooluxversion': details.version}, function() {});
        chrome.tabs.create({'url': chrome.extension.getURL('version.html')}, function (tab)
        {
            // Tab opened.
        });
    }
});

chrome.browserAction.onClicked.addListener(function (tab)
{
    'use strict';
    
    chrome.tabs.executeScript(null, {code:"jQuery(window).trigger('browser_action_clicked', [])"});
});

screenFunction = function (pos)
{
    'use strict';
    
    chrome.tabs.captureVisibleTab(
        null,
        {
            format: 'jpeg',
            quality: 100
        },
        function (img)
        {
            
            var image = new Image(),
                canvas = document.createElement('canvas'),
                context;
                
            image.onload = function ()
            {
                canvas.width = pos.width;
                canvas.height = pos.height;
                
                context = canvas.getContext("2d");
                context.drawImage(
                    image,
                    pos.startX,
                    pos.startY,
                    pos.width,
                    pos.height,
                    0,
                    0,
                    pos.width,
                    pos.height
                );
                
                chrome.tabs.executeScript(
                    null,
                    {
                        code:"Toolux.saveImg('" + canvas.toDataURL('image/jpeg') + "');"
                    }
                );
            };
            image.src = img;
        }
    );
};

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse)
    {
        'use strict';
        
        if(request.msg === "screenFunc") {
            screenFunction(request.pos);
        }else if(request.msg === "help") {
            chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function (tab)
            {
                // Tab opened.
            });
        }else if (request.msg === "bug") {
            chrome.tabs.create({'url': 'https://github.com/nicolasadfab/toolux/issues/new'}, function (tab)
            {
                // Tab opened.
            });
        }
    }
);