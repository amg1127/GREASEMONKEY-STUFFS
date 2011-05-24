// ==UserScript==
// @name           YouTube via HTTPS
// @namespace      http://localhost/
// @description    Faz o YouTube usar sempre HTTPS
// @include        *
// ==/UserScript==

window.addEventListener ("load", function () {
    var s = "." + window.location.hostname;
    if (s.substring(s.length - 12, s.length).toLowerCase() == ".youtube.com") {
        if (window.location.protocol == "http:") {
            window.location.replace ("https:" + window.location.href.substring(5));
        }
    } else {
        s = document.documentElement.innerHTML.replace(/http:\/\/www\.youtube\.com\//ig, "https://www.youtube.com/").replace(/http:\/\/youtube\.com\//ig, "https://youtube.com/");
        if (document.documentElement.innerHTML != s) {
            document.documentElement.innerHTML = s;
        }
    }
}, true);
