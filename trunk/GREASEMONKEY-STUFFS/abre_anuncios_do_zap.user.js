// ==UserScript==
// @name           Abre anuncios do ZAP
// @namespace      http://localhost
// @description    Abrir todos os anuncios do ZAP encontrados no e-mail
// @include        https://mail.google.com/mail/*
// ==/UserScript==

var abreanuncioszap_magic = "http://www.zap.com.br/imoveis/detalhes.aspx?imovel=";
var abreanuncioszap_lenmagic = abreanuncioszap_magic.length;
var abreanuncioszap_maxtents = 240;
var abreanuncioszap_timeout = 500;
var abreanuncioszap_tents = abreanuncioszap_maxtents;
var abreanuncioszap_iframeno = -1;

function abreanuncioszap_onloadfunc () {
    var canvastest = document.getElementById ("canvas_frame");
    if (canvastest) {
        if (canvastest.tagName == "IFRAME") {
            abreanuncioszap_tents = abreanuncioszap_maxtents;
            abreanuncioszap_passo2 ();
            return;
        }
    }
    if (abreanuncioszap_tents-- > 0) {
        window.setTimeout (abreanuncioszap_onloadfunc, abreanuncioszap_timeout);
    }
}

function abreanuncioszap_passo2 () {
    var ifrno, docu, lnkcorps, lni;
    for (ifrno = window.frames.length - 1; ifrno >= 0; ifrno--) {
        docu = window.frames[ifrno].document;
        lnkcorps = docu.getElementsByTagName ("A");
        for (lni = lnkcorps.length - 1; lni >= 0; lni--) {
            if (lnkcorps[lni].innerHTML == "Settings") {
                abreanuncioszap_iframeno = ifrno;
                GM_registerMenuCommand ("Abrir links de anuncios do ZAP", function () {
                    var alvos, i, l, lnk;
                    alvos = window.frames[abreanuncioszap_iframeno].document.getElementsByTagName ("A");
                    l = alvos.length;
                    for (i = 0; i < l; i++) {
                        lnk = alvos[i];
                        if (lnk.href.substring(0, abreanuncioszap_lenmagic).toLowerCase() == abreanuncioszap_magic) {
                            window.open (lnk.href);
                        }
                    }
                }
                );
                return;
            }
        }
    }
    if (abreanuncioszap_tents-- > 0) {
        window.setTimeout (abreanuncioszap_passo2, abreanuncioszap_timeout);
    }
}

if (window.location.href == window.top.location.href) {
    window.addEventListener ("load", abreanuncioszap_onloadfunc, true);
}
