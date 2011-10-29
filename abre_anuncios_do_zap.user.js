// ==UserScript==
// @name           Abre anuncios do ZAP
// @namespace      http://localhost
// @description    Abrir todos os anuncios do ZAP encontrados no e-mail
// @include        https://mail.google.com/mail/*
// ==/UserScript==

var abreanuncioszap_magic = new Array ();
abreanuncioszap_magic[0] = "http://www.zap.com.br/imoveis/oferta/";
abreanuncioszap_magic[1] = "http://www.zap.com.br/imoveis/cadastro-alerta.aspx?";
var abreanuncioszap_maxtents = 240;
var abreanuncioszap_timeout = 500;
var abreanuncioszap_tents = abreanuncioszap_maxtents;
var abreanuncioszap_iframeno = -1;
var abreanuncioszap_pendente = true;

function abreanuncioszap_onloadfunc () {
    try {
        if (window.location.href == window.top.location.href) {
            var canvastest = document.getElementById ("canvas_frame");
            if (canvastest) {
                if (canvastest.tagName == "IFRAME") {
                    abreanuncioszap_tents = abreanuncioszap_maxtents;
                    abreanuncioszap_passo2 ();
                    return;
                }
            }
        }
    } finally {
        if (abreanuncioszap_pendente && abreanuncioszap_tents-- > 0) {
            window.setTimeout (abreanuncioszap_onloadfunc, abreanuncioszap_timeout);
        }
        return (true);
    }
}

function abreanuncioszap_passo2 () {
    try {
        var ifrno, docu, lnkcorps, lni, magic_i, magic_len;
        for (ifrno = window.frames.length - 1; abreanuncioszap_pendente && ifrno >= 0; ifrno--) {
            docu = window.frames[ifrno].document;
            lnkcorps = docu.getElementsByTagName ("A");
            for (lni = lnkcorps.length - 1; lni >= 0; lni--) {
                if (lnkcorps[lni].innerHTML == "Terms &amp; Privacy") {
                    abreanuncioszap_iframeno = ifrno;
                    GM_registerMenuCommand ("Abrir links de anuncios do ZAP", function () {
                        var alvos, i, l, lnk;
                        alvos = window.frames[abreanuncioszap_iframeno].document.getElementsByTagName ("A");
                        l = alvos.length;
                        for (i = 0; i < l; i++) {
                            lnk = alvos[i];
                            for (magic_i = abreanuncioszap_magic.length - 1; magic_i >= 0; magic_i--) {
                                magic_len = abreanuncioszap_magic[magic_i].length;
                                if (lnk.href.substring(0, magic_len).toLowerCase() == abreanuncioszap_magic[magic_i]) {
                                    window.open (lnk.href);
                                }
                            }
                        }
                    }
                    );
                    abreanuncioszap_pendente = false;
                    return;
                }
            }
        }
    } finally {
        if (abreanuncioszap_pendente && abreanuncioszap_tents-- > 0) {
            window.setTimeout (abreanuncioszap_passo2, abreanuncioszap_timeout);
        }
        return (true);
    }
}

window.addEventListener ("load", abreanuncioszap_onloadfunc, true);
