function copyLink(tabInfo) {
    browser.browserAction.setBadgeText({ text: '✓' })
    setInterval(function() { browser.browserAction.setBadgeText({ text: '' }) }, 150);

    // url parser
    var parser = document.createElement('a');
    parser.href = tabInfo.url;
    /*
    parser.protocol; // => "http:"
    parser.port;     // => "3000"
    parser.pathname; // => "/pathname/"
    parser.search;   // => "?search=test"
    parser.hash;     // => "#hash"
    parser.host; // => "example.com:3000"
    */
    console.log('parser.host=> ', parser.host);
    console.log('parser.pathname=> ', parser.pathname);
    console.log('parser.search=> ', parser.search);
    console.log('parser.protocol=> ', parser.protocol);
    console.log('parser.port=> ', parser.port);
    console.log('parser.hash=> ', parser.hash);
    var path, searchs;
    if (parser.pathname.match('/')) {
        var paths = parser.pathname.split('/')
    }
    if (parser.search.match('=')) {
        var searchs = parseQuery(parser.search)
        console.log(searchs)
    }

    var url = parser.href
    switch (parser.host) {
        case 'www.facebook.com':
            url = url.toString().replace(new RegExp('https://www.facebook.com'), 'fb.com'); //replace domain
            if (paths && (paths[2] == 'photos' || 'videos'))
                var url = 'fb.com/' + paths[paths.length - 2]
            break;
        case 'www.youtube.com':
            if (searchs && searchs.v)
                url = 'youtu.be/' + searchs.v //replace domain
            break;
        case 'stackoverflow.com':
            if (paths && (paths[1] == 'questions'))
                url = 'stackoverflow.com/questions/' + paths[2] //replace domain
            break;
        case 'www.google.com':
            url = url.toString().replace(new RegExp('https://www.google.com'), 'google.com'); //replace domain
            if (searchs && searchs.q)
                url = 'google.com/search?q=' + searchs.q //replace domain
            if (searchs && searchs.q && searchs.tbm)
                url = 'google.com/search?q=' + searchs.q + '&tbm=' + searchs.tbm + (parser.hash ? parser.hash : '') //replace domain
            break;
    }
    copyToClipboard(url)
}

function parseQuery(search) {
    var args = search.substring(1).split('&');
    var argsParsed = {};
    var i, arg, kvp, key, value;
    for (i = 0; i < args.length; i++) {
        arg = args[i];
        if (-1 === arg.indexOf('=')) {
            argsParsed[decodeURIComponent(arg).trim()] = true;
        } else {
            kvp = arg.split('=');
            key = decodeURIComponent(kvp[0]).trim();
            value = decodeURIComponent(kvp[1]).trim();
            argsParsed[key] = value;
        }
    }
    return argsParsed;
}

function copyToClipboard(text) {
    function oncopy(event) {
        document.removeEventListener("copy", oncopy, true);
        // Hide the event from the page to prevent tampering.
        event.stopImmediatePropagation();

        // Overwrite the clipboard content.
        event.preventDefault();
        event.clipboardData.setData("text/plain", text);
    }
    document.addEventListener("copy", oncopy, true);

    // Requires the clipboardWrite permission, or a user gesture:
    document.execCommand("copy");
}
browser.browserAction.onClicked.addListener(copyLink);