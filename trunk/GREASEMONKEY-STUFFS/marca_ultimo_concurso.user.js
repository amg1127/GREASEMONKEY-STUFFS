// ==UserScript==
// @name           Marca ultimo concurso
// @namespace      http://localhost
// @description    Script que marca o último concurso visto
// @include        http://destaques.in.gov.br/destaques/jsp/destaque/destaque-mais-concurso-redirect.jsp
// ==/UserScript==


function onload_func () {
    var texto = "UFRJ abre inscrições de concurso público para vagas na carreira do magistério superior";
    var lt = texto.length;
    var html = document.body.innerHTML;
    var pos = html.indexOf(texto);
    if (pos < 0) {
        window.alert("Erro: texto nao foi encontrado:\n\n" + texto);
    } else {
        html = html.substring (0, pos) + "<b><font color='#ff0000'>" + texto + "</font></b>" + html.substring (pos + lt, html.length);
        document.body.innerHTML = html;
    }
}

window.addEventListener ("load", onload_func, true);
