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
    var i, obj, colec, descrdivs, manda, ohtm, obr, odiv, descricao, linha, c, olink, disparar, s;
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    colec = document.images;
    disparar = new Array();
    s = 0;
    for (i = 0; i < colec.length; i++) {
        obj = colec[i];
        manda = false;
        if (obj.className == "imgShowDetails") {
            if (obj.src.indexOf("icon_plus_v2.png") >= 0) {
                if (window.getComputedStyle(obj, null).getPropertyValue("display") == "inline") {
                    manda = true;
                    linha = obj.parentNode.parentNode;
                    descrdivs = linha.getElementsByClassName("divDescription");
                    if (descrdivs.length == 1) {
                        ohtm = descrdivs[0].innerHTML;
                        obr = ohtm.indexOf("<br>");
                        odiv = ohtm.indexOf("<div class=\"divCompanyName\">");
                        if (obr >= 0 && obr < odiv) {
                            descricao = Trim (ohtm.substring(obr + 4, odiv));
                            if (descricao && descricao.indexOf("<") < 0 && descricao.indexOf(">") < 0) {
                                descricao = descricao.toLowerCase();
                                if (! tem_garagem (descricao)) {
                                    descrdivs = linha.getElementsByClassName("tdAddress");
                                    if (descrdivs.length == 1) {
                                        ohtm = descrdivs[0].innerHTML;
                                        odiv = ohtm.indexOf("<div class=\"divDetails\">");
                                        if (odiv >= 0) {
                                            descricao = Trim (ohtm.substring (0, odiv));
                                            odiv = ohtm.indexOf("<img alt=\"Icon_new\" src=\"/images/icon_new.png?");
                                            if (odiv >= 0) {
                                                descricao = Trim (ohtm.substring (0, odiv));
                                            }
                                            if (descricao && descricao.indexOf("<") < 0 && descricao.indexOf(">") < 0) {
                                                descricao = descricao.toLowerCase();
                                                if (! tem_garagem (descricao)) {
                                                    manda = false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (manda) {
                        descrdivs = linha.getElementsByTagName("a");
                        for (c = 0; c < descrdivs.length; c++) {
                            olink = descrdivs[c];
                            if (olink.innerHTML == "Ver no site da imobiliária") {
                                if (window.getComputedStyle(olink, null).getPropertyValue("color") == "rgb(51, 0, 153)") {
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
