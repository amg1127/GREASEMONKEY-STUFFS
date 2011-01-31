// ==UserScript==
// @name           Abre a portaria do DETRAN
// @namespace      http://localhost/
// @description    Abre a portaria do DETRAN especificada no comando
// @include        http://www.detran.rs.gov.br/*
// ==/UserScript==

var abrirportar = "abrirportariaautomaticamente";
GM_registerMenuCommand ("Abrir uma portaria", portaria_func);

function onload_func () {
    var locase, lapos, idportaria, i, l, olnk;
    locase = top.location.search;
    if (locase.charAt(0) == "?") {
        locase = "&" + locase.substring (1);
    } else if (locase.charAt(0) != "&") {
        locase = "&" + locase;
    }
    locase += "&";
    lapos = locase.indexOf ("&" + abrirportar + "=");
    if (lapos >= 0) {
        lapos += abrirportar.length + 2;
        idportaria = locase.substring (lapos, locase.indexOf ("&", lapos));
        if (idportaria) {
            l = document.links.length;
            for (i = 0; i < l; i++) {
                olnk = document.links[i];
                if (olnk.innerHTML == idportaria) {
                    top.location.replace (olnk.href);
                    return;
                } else if (olnk.innerHTML > idportaria) {
                    olnk.scrollIntoView ();
                }
            }
        }
        top.alert ("Portaria nao especificada ou nao encontrada!");
    }
}

function portaria_func () {
    var idportaria, expreg, matches, url, janela;
    while ((idportaria = top.prompt ("Digite o numero da portaria:\n\n    # nn-yyyy para abrir em uma nova janela\n    # nn.yyyy para abrir em uma nova janela em foco\n    # nn/yyyy para abrir na mesma janela", ""))) {
        expreg = new RegExp ("^\\s*(\\d+)([-/\\.])(\\d+)\\s*$");
        matches = expreg.exec (idportaria);
        if (matches != null) {
            url = "http://www.detran.rs.gov.br/index.php?action=pub&cod=2&ano=" + matches[3] + "&" + abrirportar + "=" + matches[1];
            if (matches[2] == "/") {
                top.location.replace (url);
            } else if ((janela = GM_openInTab (url))) {
                if (matches[2] == ".") {
                    janela.focus ();
                } else {
                    top.focus ();
                }
            }
            break;
        } else {
            top.alert ("Numero de portaria invalido: " + idportaria);
        }
    }
}

window.addEventListener ("load", onload_func, true);
