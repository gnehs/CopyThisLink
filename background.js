function copyLink(tabInfo) {

    // url parser
    var parser = document.createElement('a');
    parser.href = tabInfo.url;

    var url = parser.href
    var path, searchs;
    if (parser.pathname.match('/')) {
        var paths = parser.pathname.split('/')
    }
    if (parser.search.match('=')) {
        var searchs = parseQuery(parser.search)
    }
    // Debug
    console.log('parser.href=> ', parser.href);
    console.log('parser.host=> ', parser.host);
    console.log('parser.pathname=> ', parser.pathname);
    console.log('parser.search=> ', parser.search);
    console.log('parser.protocol=> ', parser.protocol);
    console.log('parser.port=> ', parser.port);
    console.log('parser.hash=> ', parser.hash);
    console.log('searchs=> ', searchs)
    console.log('paths=> ', paths)

    switch (parser.host) {
        case 'www.facebook.com':
            url = url.toString().replace(new RegExp('https://www.facebook.com'), 'fb.com'); //replace domain
            // https://www.facebook.com/不專業meme翻譯-773886686132686/
            // -> fb.com/773886686132686
            if (paths && paths[1].split('-')[1])
                var url = 'fb.com/' + paths[1].split('-')[1]

            //https://www.facebook.com/crippli.../2160482180633441/?type=3&theater
            // -> fb.com/2160482180633441
            if (paths && (paths[2] == 'photos' || paths[2] == 'videos'))
                var url = 'fb.com/' + paths[paths.length - 2]
            if (paths && paths[1] == 'photo.php')
                var url = 'fb.com/' + searchs.fbid
            if (paths && paths[2] == 'posts')
                var url = 'fb.com/' + paths[paths.length - 1]
            break;
        case 'www.youtube.com':
            if (searchs && searchs.v)
                url = 'youtu.be/' + searchs.v
            break;
        case 'stackoverflow.com':
            if (paths && (paths[1] == 'questions') && !parser.hash)
                url = 'stackoverflow.com/questions/' + paths[2]
            break;
        case 'userstyles.org':
            if (paths && (paths[1] == 'styles'))
                url = 'userstyles.org/styles/' + paths[2]
            break;
        case 'www.google.com':
            url = url.toString().replace(new RegExp('https://www.google.com'), 'google.com'); //replace domain
            if (searchs && searchs.q)
                url = 'google.com/search?q=' + searchs.q
            if (searchs && searchs.q && searchs.tbm)
                url = 'google.com/search?q=' + searchs.q + '&tbm=' + searchs.tbm + (parser.hash ? parser.hash : '')
            break;
        case 'shopee.tw':
            // https://shopee.tw/%E7%8F%BE%E8%B...%E6%9E%B6-i.5319622.643281846
            // => https://shopee.tw/product/5319622/643281846/
            var shopeePath = parser.pathname.split('-')
            var shopeePath = shopeePath[shopeePath.length - 1].split('.')
            if (shopeePath[0] == 'i' && shopeePath.length == 3)
                url = 'shopee.tw/product/' + shopeePath[1] + '/' + shopeePath[2];
            break;
    }
    setBadgeText(parser.href == url)
    copyToClipboard(url);
}

function setBadgeText(s) {
    if (s) {
        browser.browserAction.setBadgeText({ text: '-' })
        browser.browserAction.setBadgeBackgroundColor({ color: "#000" });
    } else {
        browser.browserAction.setBadgeText({ text: '✓' })
        browser.browserAction.setBadgeBackgroundColor({ color: "green" });
    }
    setInterval(function() { browser.browserAction.setBadgeText({ text: '' }) }, 100);
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

function copyToClipboard(link) {
    var txtToCopy = document.createElement('input');
    txtToCopy.style.left = '-300px';
    txtToCopy.style.position = 'absolute';
    txtToCopy.value = link;
    document.body.appendChild(txtToCopy);
    txtToCopy.select();
    var res = document.execCommand('copy');
    txtToCopy.parentNode.removeChild(txtToCopy);
}
browser.browserAction.onClicked.addListener(copyLink);