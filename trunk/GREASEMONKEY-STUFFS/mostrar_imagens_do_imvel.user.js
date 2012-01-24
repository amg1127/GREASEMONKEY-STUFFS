// ==UserScript==
// @name           Mostrar imagens do imóvel
// @namespace      http://localhost
// @description    Mostra automaticamente as imagens do imóvel
// @include        http://www.zap.com.br/imoveis/oferta/*
// ==/UserScript==

function abreimagenszap_onloadfunc () {
    var oifr, intdoc, iimgs, l, i, colecs, inht, regexp, c;
    regexp = new RegExp ("^https?://img\.zapcorp\.com\.br/.*/[a-fA-F0-9]+\.jpg$", "i");
    colecs = new Array ();
    iimgs = document.images;
    l = iimgs.length;
    for (i = 0; i < l; i++) {
        inht = iimgs[i].src;
        if (regexp.test (inht)) {
            inht = inht.substring (0, inht.length - 4) + "_grande.jpg";
            for (c = colecs.length - 1; c >= 0; c--) {
                if (colecs[c] == inht) {
                    break;
                }
            }
            if (c < 0) {
                colecs[colecs.length] = inht;
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
