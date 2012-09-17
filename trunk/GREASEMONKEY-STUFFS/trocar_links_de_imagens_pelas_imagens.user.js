// ==UserScript==
// @name           Trocar links de imagem pelas imagens
// @namespace      http://localhost
// @description    Troca os links que apontam para imagens pelas imagens reais
// @grant          GM_registerMenuCommand
// ==/UserScript==

var trocalinks_naorodou = true;

function trocalinks_onload_func () {
    var i, img, ourl, ourl2, olnktrocar, olnk_l, papi, zind;
    if (trocalinks_naorodou) {
        olnktrocar = new Array();
        olnk_l = 0;
        zind = 1000;
        for (i = 0; i < document.images.length; i++) {
            img = document.images[i];
            ourl = img.src;
            if (img.parentNode.tagName.toUpperCase() == 'A') {
                ourl2 = img.parentNode.href;
                if (trocalinks_valida_endereco_imagem (ourl, ourl2)) {
                    olnktrocar[olnk_l] = new Array();
                    olnktrocar[olnk_l][0] = img.parentNode;
                    olnktrocar[olnk_l][1] = ourl2;
                    olnk_l++;
                    continue;
                }
            }
            // Ver se as imagens estao dentro de alguma galeria chata...
            if (img.parentNode.tagName.toUpperCase() == 'DIV' && img.parentNode.className == 'panel') {
                if (img.parentNode.parentNode.tagName.toUpperCase() == 'DIV' && img.parentNode.parentNode.className == 'galleryview') {
                    olnktrocar[olnk_l] = new Array();
                    olnktrocar[olnk_l][0] = img;
                    olnktrocar[olnk_l][1] = null;
                    olnk_l++;
                    continue;
                }
            }
        }
        for (i = olnk_l - 1; i >= 0; i--) {
            if (olnktrocar[i][1]) {
                olnktrocar[i][0].innerHTML = "<img src='" + olnktrocar[i][1] + "' style='z-index: " + zind + ";'>";
            }
            for (papi = olnktrocar[i][0]; papi && papi.style; papi = papi.parentNode) {
                papi.style.zIndex = zind;
            }
            document.body.insertBefore (document.createElement ("BR"), document.body.firstChild);
            document.body.insertBefore (document.createElement ("BR"), document.body.firstChild);
            document.body.insertBefore (olnktrocar[i][0], document.body.firstChild);
        }
        trocalinks_naorodou = false;
    }
}

function trocalinks_valida_endereco_imagem_v1 (imagem, link) {
    var ponto;
    // imagem = http://www.servidor.com.br/pasta/imagem-baixaresol.jpg
    // link   = http://www.servidor.com.br/pasta/imagem.jpg
    ponto = link.lastIndexOf (".");
    if (ponto >= 0) {
        if (link.substring (0, ponto) == imagem.substring (0, ponto) && link.substring (ponto, link.length) == imagem.substring (imagem.length + ponto - link.length, imagem.length)) {
            return (true);
        }
    }
    return (false);
}

function trocalinks_valida_endereco_imagem_v2 (imagem, link) {
    var barra;
    // imagem = http://www.servidor.com.br/pasta/baixaresol/imagem.jpg
    // link   = http://www.servidor.com.br/pasta/altaresol/imagem.jpg
    barra = imagem.lastIndexOf ("/");
    if (barra >= 0 && link.length >= barra) {
        if (imagem.substring (barra, imagem.length) == link.substring (link.length + barra - imagem.length, link.length)) {
            barra = imagem.lastIndexOf ("/", barra - 1);
            if (barra >= 0) {
                if (imagem.substring (0, barra + 1) == link.substring (0, barra + 1)) {
                    return (true);
                }
            }
        }
    }
    return (false);
}

function trocalinks_valida_endereco_imagem (imagem, link) {
    if (imagem.indexOf ("'") < 0) {
        if (trocalinks_valida_endereco_imagem_v1 (imagem, link)) {
            return (true);
        }
        if (trocalinks_valida_endereco_imagem_v2 (imagem, link)) {
            return (true);
        }
    }
    return (false);
}

// window.addEventListener ("load", trocalinks_onload_func, true);
GM_registerMenuCommand ("Trocar links de imagens pelas imagens", trocalinks_onload_func);
