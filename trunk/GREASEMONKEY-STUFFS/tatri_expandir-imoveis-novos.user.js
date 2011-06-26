// ==UserScript==
// @name           Expandir todos os imoveis
// @namespace      http://localhost
// @description    Expande todos os imoveis automaticamente.
// @include        http://imoveis.tatri.com.br/alugar/PortoAlegre?*
// @include        http://imoveis.tatri.com.br/alugar/PortoAlegre/*
// ==/UserScript==

function Trim (str) {
    return str.replace (/^\s+|\s+$/g,"");
}

function tem_garagem (descricao) {
    var pos, pos2;
    var banheiro = "banheiro c/box";
    if (descricao.indexOf("gar") >= 0) return (true);
    while ((pos = descricao.indexOf("box")) >= 0) {
        pos2 = descricao.indexOf(banheiro);
        if (pos - pos2 != 11 || pos2 < 0) return (true);
        descricao = descricao.substring (pos + 3, descricao.length);
    }
    return (false);
}

function onload_func () {
    var i, obj, colec, descrdivs, manda, ohtm, obr, odiv, descricao, linha, c, olink, disparar, s, acor;
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    colec = document.images;
    disparar = new Array();
    s = 0;
    for (i = 0; i < colec.length; i++) {
        obj = colec[i];
        manda = false;
        if (obj.className == "imgShowDetails") {
            if (obj.alt == "Exibir detalhes") {
                if (window.getComputedStyle(obj, null).getPropertyValue("display") == "inline") {
                    manda = true;
                    linha = obj.parentNode.parentNode;
                    descrdivs = linha.getElementsByClassName("divDescription");
                    if (descrdivs.length == 1) {
                        ohtm = descrdivs[0];
                        if (ohtm.childNodes.length > 2) {
                            descricao = Trim (ohtm.childNodes[2].nodeValue);
                            descricao = descricao.toLowerCase();
                            if (! tem_garagem (descricao)) {
                                // manda = false;
                            }
                        }
                    }
                    if (manda) {
                        descrdivs = linha.getElementsByTagName("a");
                        for (c = 0; c < descrdivs.length; c++) {
                            olink = descrdivs[c];
                            if (olink.title == "Ver detalhes do imóvel") {
                                acor = window.getComputedStyle(olink, null).getPropertyValue("color");
                                acor = acor.toLowerCase();
                                // Droga... Isso não funciona mais! http://hacks.mozilla.org/2010/03/privacy-related-changes-coming-to-css-vistited/
                                if (acor == "rgb(51, 0, 153)") {
                                    manda = false;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (manda) {
            disparar[s++] = obj;
        }
    }
    if (s > 0) {
        disparar[0].scrollIntoView (true);
        for (i = 0; i < s; i++) {
            disparar[i].dispatchEvent (evt);
        }
    }
}

window.addEventListener ("load", onload_func, true);
