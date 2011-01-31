// ==UserScript==
// @name           Nao abrir leis em novas janelas
// @namespace      http://localhost/
// @description    Quando eu procuro legislacao, links abrem em uma nova janela. Quero que abram na mesma janela ou em uma nova aba!
// @include        http://www.al.rs.gov.br/legis/*
// ==/UserScript==

function naoabrirleis_capturalinks () {
    var i, l, olnk, regexp, matches, novohref;
    regexp = new RegExp ("^\\s*javascript:\\s*mostra_ata\\s*\\(['\"]?(\\d+)['\"]?\\s*,", "i");
    if (document.links) {
        l = document.links.length;
        for (i = 0; i < l; i++) {
            olnk = document.links[i];
            matches = regexp.exec (olnk.href);
            if (matches != null) {
                novohref = "http://www.al.rs.gov.br/legis/M010/M0100018.asp?Hid_IdNorma=" + matches[1];
                olnk.href = novohref;
                olnk.target = "_self";
            }
        }
    }
}

window.addEventListener ("load", naoabrirleis_capturalinks, true);