// ==UserScript==
// @name           Navegacao de imagens
// @namespace      http://localhost
// @description    Script para facilitar a navegacao de paginas com muitas fotos
// @include        *
// @exclude        http://maps.google.com/*
// ==/UserScript==

var navegaimg_imgpos = 0;
var navegaimg_prev_state = false;
var navegaimg_next_state = false;
var navegaimg_timer = null;
var navegaimg_resptimer = 5000;
var navegaimg_redimed = false;
var navegaimg_timeout = false;
var navegaimg_dimensoes = new Array ();
var navegaimg_referencia = document.documentElement;
var navegaimg_naochamou = true;
var navegaimg_minwidth = 480;
var navegaimg_minheight = 360;

function navegaimg_mostraimg (elemento) {
    elemento.scrollIntoView (true);
}

function navegaimg_btnnext_click () {
    navegaimg_next_state = (! navegaimg_next_state);
    navegaimg_btnnextlasthelper (0, 0, navegaimg_next_state, "Voltar para a primeira imagem?", navegaimg_btnfirst_click);
    if (navegaimg_next_state) {
        window.setTimeout (navegaimg_btnnext_click, 10);
    }
}

function navegaimg_btnprev_click () {
    navegaimg_prev_state = (! navegaimg_prev_state);
    navegaimg_btnnextlasthelper (navegaimg_referencia.scrollWidth, navegaimg_referencia.scrollHeight, navegaimg_prev_state, "Avancar para a ultima imagem?", navegaimg_btnlast_click);
    if (navegaimg_prev_state) {
        window.setTimeout (navegaimg_btnprev_click, 10);
    }
}

function navegaimg_btnnextlasthelper (posx, posy, bandeira, questao, funcao) {
    var img, pxc, pyc, i, img_pos, img_cand, img_cand_pos, menor, elem, dist;
    menor = 0;
    elem = null;
    pxc = navegaimg_referencia.scrollLeft;
    pyc = navegaimg_referencia.scrollTop;
    img = navegaimg_imgmaisperto (pxc, pyc);
    if (img) {
        img_cand_pos = navegaimg_calcdist (img, pxc, pyc);
        if (bandeira) {
            navegaimg_imgpos = img_cand_pos;
            navegaimg_mostraimg (img);
        } else if (img_cand_pos == navegaimg_imgpos) {
            img_pos = navegaimg_calcdist (img, posx, posy);
            for (i = 0; i < document.images.length; i++) {
                img_cand = document.images[i];
                if (navegaimg_validaimagem (img_cand)) {
                    if (! img_cand.isSameNode (img)) {
                        img_cand_pos = navegaimg_calcdist (img_cand, posx, posy);
                        dist = img_cand_pos - img_pos;
                        if (dist >= 0 && ((! elem) || menor >= dist)) {
                            menor = dist;
                            elem = img_cand;
                        }
                    }
                }
            }
            if (elem) {
                navegaimg_mostraimg (elem);
                navegaimg_controlaslideshow ();
            } else if (navegaimg_timeout || window.confirm (questao)) {
                funcao ();
            }
        } else {
            navegaimg_controlaslideshow ();
        }
    }
}

function navegaimg_controlaslideshow () {
    if (navegaimg_timer) {
        navegaimg_btnslideshow_click ();
    } else if (navegaimg_timeout) {
        navegaimg_timer = window.setTimeout (navegaimg_timertimeout, navegaimg_resptimer);
    }
}

function navegaimg_btnfirst_click () {
    if ((elem = navegaimg_imgmaisperto (0, 0))) {
        navegaimg_mostraimg (elem);
        navegaimg_controlaslideshow ();
    }
}

function navegaimg_btnlast_click () {
    if ((elem = navegaimg_imgmaisperto (navegaimg_referencia.scrollWidth, navegaimg_referencia.scrollHeight))) {
        navegaimg_mostraimg (elem);
        navegaimg_controlaslideshow ();
    }
}

function navegaimg_validaimagem (elemento) {
    return (elemento.offsetWidth >= navegaimg_minwidth || elemento.offsetHeight >= navegaimg_minheight);
}

function navegaimg_imgmaisperto (px, py) {
    var i, menor, elem, img;
    elem = null;
    menor = 0;
    for (i = document.images.length - 1; i >= 0; i--) {
        img = document.images[i];
        if (navegaimg_validaimagem (img)) {
            dist = navegaimg_calcdist (img, px, py);
            if ((! elem) || menor >= dist) {
                menor = dist;
                elem = img;
            }
        }
    }
    return (elem);
}

function navegaimg_determpos (elemento) {
    var l, t, nave, resp;
    l = 0;
    t = 0;
    for (nave = elemento; nave; nave = nave.offsetParent) {
        l += nave.offsetLeft;
        t += nave.offsetTop;
    }
    resp = new Array();
    resp[0] = l;
    resp[1] = t;
    return (resp);
}

function navegaimg_calcdist (elemento, px, py) {
    var rox = navegaimg_determpos (elemento);
    rox[0] -= px;
    rox[1] -= py;
    return (Math.sqrt (rox[0] * rox[0] + rox[1] * rox[1]));
}

function navegaimg_createbutton (id, label, reply) {
    var nobj;
    nobj = document.createElement ("input");
    nobj.id = id;
    nobj.type = 'button';
    nobj.value = label;
    nobj.addEventListener("click", reply, true);
    document.getElementById("navegaimg_span").appendChild (nobj);
    return (nobj);
}

function navegaimg_onunload_func () {
    var nobj, papi;
    if (! navegaimg_naochamou) {
        nobj = document.getElementById ("navegaimg_span");
        if (nobj) {
            papi = nobj.parentNode;
            papi.removeChild (nobj);
        }
        navegaimg_naochamou = true;
    }
}

function navegaimg_onload_func () {
    var nobj, temimg = false, i, l;
    if (navegaimg_naochamou) {
        navegaimg_naochamou = false;
        l = document.images.length;
        for (i = 0; i < l; i++) {
            if (navegaimg_validaimagem (document.images[i])) {
                temimg = true;
                break;
            }
        }
        if (temimg) {
            if (window.location.href.toLowerCase().substring(0, 30) == "https://mail.google.com/mail/?") {
                navegaimg_referencia = document.body;
            }
            nobj = document.createElement ("span");
            nobj.id = "navegaimg_span";
            nobj.style.cssText = "position: fixed; top: 0px; right: 10px; z-index: 9999; text-align: center;";
            document.body.insertBefore (nobj, document.body.firstChild);
            navegaimg_createbutton('navegaimg_btnfirst', '<<', navegaimg_btnfirst_click);
            navegaimg_createbutton('navegaimg_btnprev', '  <  ', navegaimg_btnprev_click);
            navegaimg_createbutton('navegaimg_btnnext', '  >  ', navegaimg_btnnext_click);
            navegaimg_createbutton('navegaimg_btnlast', '>>', navegaimg_btnlast_click);
            document.getElementById("navegaimg_span").appendChild(document.createElement("br"));
            navegaimg_createbutton('navegaimg_btnslideshow', 'Play slideshow', navegaimg_btnslideshow_click);
            document.getElementById("navegaimg_span").appendChild(document.createElement("br"));
            navegaimg_createbutton('navegaimg_btnredim', 'Fit images to window', navegaimg_btnredim_click);
        }
    }
}

function navegaimg_btnredim_click () {
    var i, dime, img, ratiox, ratioy, wjan, hjan, c, posic, taxa, tole;
    pxc = navegaimg_referencia.scrollLeft;
    pyc = navegaimg_referencia.scrollTop;
    posic = navegaimg_imgmaisperto (pxc, pyc);
    if (posic) {
        if (navegaimg_redimed) {
            navegaimg_redimed = false;
            document.getElementById('navegaimg_btnredim').value = 'Fit images to window';
            for (i = 0; i < document.images.length; i++) {
                img = document.images[i];
                if (img.isSameNode (navegaimg_dimensoes[i][2])) {
                    img.width = navegaimg_dimensoes[i][0];
                    img.height = navegaimg_dimensoes[i][1];
                } else {
                    for (c = 0; c < navegaimg_dimensoes.length; c++) {
                        if (img.isSameNode (navegaimg_dimensoes[c][2])) {
                            img.width = navegaimg_dimensoes[c][0];
                            img.height = navegaimg_dimensoes[c][1];
                            break;
                        }
                    }
                }
            }
        } else {
            // taxa = 1 / 1.25;
            taxa = 1.0;
            if (navegaimg_validaimagem (navegaimg_referencia)) {
                tole = 10;
                wjan = navegaimg_referencia.clientWidth;
                if (wjan < (navegaimg_minwidth + tole)) {
                    wjan = (navegaimg_minwidth + tole);
                }
                hjan = navegaimg_referencia.clientHeight;
                if (hjan < (navegaimg_minheight + tole)) {
                    hjan = (navegaimg_minheight + tole);
                }
                navegaimg_redimed = true;
                document.getElementById('navegaimg_btnredim').value = 'Restore image sizes';
                navegaimg_dimensoes = new Array();
                for (i = 0; i < document.images.length; i++) {
                    img = document.images[i];
                    dime = new Array();
                    dime[0] = img.width;
                    dime[1] = img.height;
                    dime[2] = img;
                    navegaimg_dimensoes[i] = dime;
                    if (navegaimg_validaimagem (img)) {
                        ratiox = 1.0 * dime[0] / wjan;
                        ratioy = 1.0 * dime[1] / hjan;
                        if (ratiox >= ratioy && ratiox >= taxa) {
                            img.width = Math.round (dime[0] / ratiox);
                            img.height = Math.round (dime[1] / ratiox);
                        } else if (ratioy >= ratiox && ratioy >= taxa) {
                            img.width = Math.round (dime[0] / ratioy);
                            img.height = Math.round (dime[1] / ratioy);
                        } else if (taxa >= ratiox && taxa >= ratioy) {
                            img.width = Math.round (dime[0] / taxa);
                            img.height = Math.round (dime[1] / taxa);
                        }
                    }
                }
            }
        }
        navegaimg_mostraimg (posic);
    }
}

function navegaimg_btnslideshow_click () {
    var resp;
    if (navegaimg_timeout) {
        navegaimg_timeout = false;
        if (navegaimg_timer) {
            window.clearTimeout (navegaimg_timer);
            navegaimg_timer = null;
        }
        document.getElementById('navegaimg_btnslideshow').value = 'Play slideshow';
    } else {
        resp = window.prompt ("Interval:", navegaimg_resptimer);
        if (resp) {
            resp = parseInt (resp, 10);
            if (resp > 100) {
                navegaimg_resptimer = resp;
                navegaimg_timer = window.setTimeout (navegaimg_timertimeout, navegaimg_resptimer);
                document.getElementById('navegaimg_btnslideshow').value = 'Stop slideshow';
                navegaimg_timeout = true;
            }
        }
    }
}

function navegaimg_timertimeout () {
    if (navegaimg_prev_state || navegaimg_next_state) {
        navegaimg_timer = window.setTimeout (navegaimg_timertimeout, navegaimg_resptimer);
    } else {
        navegaimg_timer = null;
        navegaimg_btnnext_click ();
    }
}

try {
    if (window.location.href == window.top.location.href) {
        window.addEventListener ("load", navegaimg_onload_func, true);
        GM_registerMenuCommand ("Ativar botões de navegação de imagens", navegaimg_onload_func);
        GM_registerMenuCommand ("Desativar botões de navegação de imagens", navegaimg_onunload_func);
    }
} finally {
    ;
}
