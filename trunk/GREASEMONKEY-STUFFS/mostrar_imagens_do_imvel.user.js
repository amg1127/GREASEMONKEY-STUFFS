// ==UserScript==
// @name           Mostrar imagens do imóvel
// @namespace      http://localhost
// @description    Mostra automaticamente as imagens do imóvel
// @include        http://www.zap.com.br/imoveis/oferta/*
// ==/UserScript==

function abreimagenszap_onloadfunc () {
    var oifr, intdoc, iimgs, l, i, olnk, colecs, inht, regexp, match, c;
    regexp = new RegExp ("^\\s*<a\\s+href=['\"]?#['\"]?\\s+onclick=['\"]showThis\\(['\"](https?://img\.zapcorp\.com\.br/[^'\"]+_grande.jpg)['\"]\\s*,", "i");
    colecs = new Array ();
    oifr = document.getElementById ("ctl00_ContentPlaceHolder1_resumo_ucFotos_if_Carrossel");
    if (oifr) {
        if (oifr.tagName == "IFRAME") {
            intdoc = oifr.contentWindow;
            iimgs = intdoc.document.images;
            l = iimgs.length;
            for (i = 0; i < l; i++) {
                if (iimgs[i].src.substring (0, 26) == "http://img.zapcorp.com.br/") {
                    olnk = iimgs[i].parentNode;
                    if (olnk.tagName == "A" && olnk.childNodes.length == 1) {
                        olnk = olnk.parentNode;
                        if (olnk.tagName == "TD" && olnk.childNodes.length == 1) {
                            inht = olnk.innerHTML;
                            match = regexp.exec (inht);
                            if (match != null) {
                                for (c = colecs.length - 1; c >= 0; c--) {
                                    if (colecs[c] == match[1]) {
                                        break;
                                    }
                                }
                                if (c < 0) {
                                    colecs[colecs.length] = match[1];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    iimgs = document.createElement ("br");
    document.body.insertBefore (iimgs, document.body.firstChild);
    l = colecs.length;
    for (i = l - 1; i >= 0; i--) {
        iimgs = document.createElement ("span");
        iimgs.innerHTML = " ";
        document.body.insertBefore (iimgs, document.body.firstChild);
        iimgs = document.createElement ("img");
        iimgs.src = colecs[i];
        document.body.insertBefore (iimgs, document.body.firstChild);
    }
}

if (window.location.href == window.top.location.href) {
    window.addEventListener ("load", abreimagenszap_onloadfunc, true);
}
