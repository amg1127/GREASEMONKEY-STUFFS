// ==UserScript==
// @name           Botoes uteis
// @namespace      http://localhost
// @description    Botoes Uteis
// @include        http://www.concursos.correioweb.com.br/forum/viewtopic.php?*
// ==/UserScript==

var botoes_uteis_automatico_str = "#VAI_PARA_A_ULTIMA_PAGINA";
var botoes_uteis_propriedades = null;

function botoes_uteis_get_search_key (url, key) {
    var interrog, outro, pesk, ahn, i, kleng, kegu;
    kegu = key + "=";
    kleng = kegu.length;
    interrog = url.indexOf ("?");
    if (interrog >= 0) {
        pesk = url.indexOf ("#");
        if (pesk < 0) {
            pesk = url.length;
        }
        outro = url.substring(interrog + 1, pesk).split("&");
        for (i = 0; i < outro.length; i++) {
            ahn = outro[i];
            if (ahn.substring (0, kleng) == kegu) {
                return (ahn.substring (kleng, ahn.length));
            }
        }
    }
    return ("");
}

function botoes_uteis_set_search_key (url, key, value) {
    var interrog, outro, pesk, ahn, i, kleng, kegu;
    kegu = key + "=";
    kleng = kegu.length;
    interrog = url.indexOf ("?");
    if (interrog >= 0) {
        pesk = url.indexOf ("#");
        if (pesk < 0) {
            pesk = url.length;
        }
        outro = url.substring(interrog + 1, pesk).split("&");
        for (i = 0; i < outro.length; i++) {
            ahn = outro[i];
            if (ahn.substring (0, kleng) == kegu) {
                break;
            }
        }
        outro[i] = kegu + value;
        return (url.substring (0, interrog + 1) + outro.join("&"));
    } else {
        pesk = url.indexOf ("#");
        if (pesk < 0) {
            pesk = url.length;
        }
        return (url.substring (0, pesk) + "?" + key + "=" + value);
    }
}

function botoes_uteis_determina_propriedades () {
    var spans, i, menupags, spam, filho, lnks, lnk, uniq, c, leps, lnkt, topi;
    if (botoes_uteis_propriedades) {
        return (botoes_uteis_propriedades);
    }
    menupags = "Ir à página ";
    spans = document.getElementsByClassName ("nav");
    lnks = new Array ();
    topi = parseInt (botoes_uteis_get_search_key (window.location.href, "t"), 10);
    if (topi < 1 || isNaN (topi)) {
        return (null);
    }
    for (i = 0; i < spans.length; i++) {
        spam = spans[i];
        if (spam.innerHTML.indexOf (menupags) == 0) {
            break;
        }
    }
    if (i >= spans.length) {
        return (null);
    }
    uniq = -1;
    for (filho = spam.firstChild; filho != null; filho = filho.nextSibling) {
        if (filho.nodeName == "#text" && filho.textContent == " ... ") {
            if (uniq < 0) {
                lnk = new Array ();
                lnk[0] = filho;
                lnk[1] = "-";
                lnk[2] = null;
                lnks[uniq = lnks.length] = lnk;
            } else {
                return (null);
            }
        } else {
            if (filho.nodeName == "A") {
                lnk = new Array ();
                lnk[0] = filho;
                lnk[1] = filho.textContent;
                lnk[2] = filho.href;
            } else if (filho.nodeName == "B") {
                lnk = new Array ();
                lnk[0] = filho;
                lnk[1] = filho.textContent;
                lnk[2] = window.location.href;
            } else {
                lnk = null;
            }
            if (lnk != null) {
                i = parseInt(lnk[1], 10);
                if ((! isNaN (i)) && ("" + i + "") == lnk[1]) {
                    lnk[1] = i;
                    leps = botoes_uteis_get_search_key (lnk[2], "start");
                    if (leps == "") {
                        leps = 0;
                        if (filho.nodeName != "B" || i != 1) {
                            return (null);
                        }
                    } else {
                        leps = parseInt (leps, 10);
                        if (isNaN (leps)) {
                            return (null);
                        }
                    }
                    lnk[3] = leps;
                    lnks[lnks.length] = lnk;
                }
            }
        }
    }
    if (lnks.length < 2 || (uniq >= 0 && uniq < 2) || (uniq + 2) >= lnks.length) {
        return (null);
    }
    if (uniq < 0) {
        i = lnks.length;
    } else {
        i = uniq;
    }
    for (i--; i >= 0; i--) {
        if (((lnks[i][1] - 1) != i) || ((i * lnks[1][3]) != lnks[i][3])) {
            return (null);
        }
    }
    for (i = uniq + 1; i < lnks.length; i++) {
        if (((lnks[i][1] - 1) * lnks[1][3]) != lnks[i][3]) {
            return (null);
        }
    }
    if (uniq > 0) {
        lnkt = new Array();
        for (i = 0; (i + 1) < uniq; i++) {
            lnkt[i] = lnks[i];
        }
        for (i = lnks[uniq - 1][3]; i != lnks[uniq + 1][3]; i += lnks[1][3]) {
            if (i > lnks[uniq + 1][3]) {
                return (null);
            } else {
                lnk = new Array ();
                lnk[0] = null;
                lnk[1] = (i / lnks[1][3]) + 1;
                lnk[2] = botoes_uteis_set_search_key (window.location.href, "start", i);
                lnk[3] = i;
                lnkt[lnkt.length] = lnk;
            }
        }
        i = lnkt.length - 1;
        if ((lnks[uniq + 1][1] - lnkt[i][1]) != 1 || (lnks[uniq + 1][3] - lnkt[i][3]) != lnks[1][3]) {
            return (null);
        }
        for (i = uniq + 1; i < lnks.length; i++) {
            lnkt[lnkt.length] = lnks[i];
        }
    } else {
        lnkt = lnks;
    }
    botoes_uteis_propriedades = lnkt;
    return (botoes_uteis_propriedades);
}

function botoes_uteis_todos_click () {
    var propriedades, i;
    propriedades = botoes_uteis_determina_propriedades ();
    if (propriedades != null) {
        for (i = 0; i < propriedades.length; i++) {
            window.open (propriedades[i][2]);
        }
        window.close();
        window.setTimeout (botoes_uteis_alerta_fechar, 1000);
    }
}

function botoes_uteis_alerta_fechar () {
    window.alert ("Feche esta janela!");
}

function botoes_uteis_ultima_pagina () {
    var propriedades, c, t, l, t, dist, maxdist, elem, i, nave;
    propriedades = botoes_uteis_determina_propriedades ();
    if (propriedades != null) {
        c = propriedades[propriedades.length - 1];
        t = botoes_uteis_get_search_key (window.location.href, "start");
        if (t != c[3]) {
            window.location.replace(c[2] + botoes_uteis_automatico_str);
        } else {
            propriedades = document.getElementsByClassName("postbody");
            for (i = 0; i < propriedades.length; i++) {
                elem = null;
                l = 0;
                t = 0;
                for (nave = propriedades[i]; nave; nave = nave.offsetParent) {
                    l += nave.offsetLeft;
                    t += nave.offsetTop;
                }
                dist = Math.sqrt (l * l + t * t);
                if (elem == null || maxdist < dist) {
                    maxdist = dist;
                    elem = propriedades[i];
                }
            }
            if (elem != null) {
                elem.scrollIntoView (true);
            }
        }
    }
}

function botoes_uteis_createbutton (id, label, reply) {
    var nobj;
    nobj = document.createElement ("input");
    nobj.id = id;
    nobj.type = 'button';
    nobj.value = label;
    nobj.addEventListener("click", reply, true);
    document.getElementById("botoes_uteis_span").appendChild (nobj);
    return (nobj);
}

function botoes_uteis_onload_func () {
    var nobj;
    if (botoes_uteis_determina_propriedades()) {
        nobj = document.createElement ("span");
        nobj.id = "botoes_uteis_span";
        nobj.style.cssText = "position: fixed; top: 0px; right: 10px; z-index: 9999; text-align: center;";
        document.body.insertBefore (nobj, document.body.firstChild);
        botoes_uteis_createbutton ('botoes_uteis_todos', 'Abrir todas as paginas', botoes_uteis_todos_click);
        if (window.location.hash == botoes_uteis_automatico_str) {
            window.setTimeout (botoes_uteis_ultima_pagina, 10);
        }
    }
}

window.addEventListener ("load", botoes_uteis_onload_func, true);