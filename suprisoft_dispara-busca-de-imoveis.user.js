// ==UserScript==
// @name           Dispara buscas dos imoveis
// @namespace      http://localhost
// @description    Script para buscar imoveis em multiplos bairros
// @include        http://visitacaovirtual.suprisoft.com.br/Visitacao.aspx?*
// ==/UserScript==

var dispara_busca_dos_imoveis_formulario = "Form1";
var dispara_busca_dos_imoveis_prefixo = "WucFiltro1_";
var dispara_busca_dos_imoveis_radiolocacao = dispara_busca_dos_imoveis_prefixo + "radiolocacao";
var dispara_busca_dos_imoveis_cmbCidade = dispara_busca_dos_imoveis_prefixo + "cmbCidade";
var dispara_busca_dos_imoveis_cmbTipo = dispara_busca_dos_imoveis_prefixo + "cmbTipo";
var dispara_busca_dos_imoveis_cmbDormitorio = dispara_busca_dos_imoveis_prefixo + "cmbDormitorio";
var dispara_busca_dos_imoveis_cmbBairro = dispara_busca_dos_imoveis_prefixo + "cmbBairro";
var dispara_busca_dos_imoveis_cmbGaragem = dispara_busca_dos_imoveis_prefixo + "cmbGaragem";
var dispara_busca_dos_imoveis_cmbValorInicial = dispara_busca_dos_imoveis_prefixo + "cmbValorInicial";
var dispara_busca_dos_imoveis_cmbValorFinal = dispara_busca_dos_imoveis_prefixo + "cmbValorFinal";
var dispara_busca_dos_imoveis_btmPesquisa = dispara_busca_dos_imoveis_prefixo + "btmPesquisa";

var dispara_busca_dos_imoveis_strings_tipo = "apto;casa;box";
dispara_busca_dos_imoveis_strings_tipo = dispara_busca_dos_imoveis_strings_tipo.split(";");
var dispara_busca_dos_imoveis_strings_bairro = "bom fim;bomfim;centro;cidade baixa;floresta;independencia;independência;" +
                                               "marcilio dias;marcílio dias;moinhos de vento;rio branco;sao geraldo;são geraldo";
dispara_busca_dos_imoveis_strings_bairro = dispara_busca_dos_imoveis_strings_bairro.split(";");

var dispara_busca_dos_imoveis_contaTipo;
var dispara_busca_dos_imoveis_contaDormitorio;
var dispara_busca_dos_imoveis_contaBairro;

var dispara_busca_dos_imoveis_timeout = 1000;

var dispara_busca_dos_imoveis_automatico_str = "#DISPARA_BUSCAS_AUTOMATICAMENTE";

function dispara_busca_dos_imoveis_localiza_elementos (elemento, mensagem) {
    var elem = document.getElementById (elemento);
    if (elem) {
        return (elem);
    } else {
        window.alert ("Impossivel encontrar o " + mensagem + "!");
        return (false);
    }
}

function dispara_busca_dos_imoveis_teste_sanidade () {
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_formulario, "formulario de busca")) {
        if (document.documentElement.innerHTML.indexOf ("The requested URL could not be retrieved") >= 0) {
            window.location.reload ();
        } else {
            return (false);
        }
    }
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_radiolocacao, "radio que seleciona a busca de alugueis")) return (false);
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_cmbCidade, "combo que seleciona a cidade de busca")) return (false);
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_cmbTipo, "combo que seleciona o tipo do imovel")) return (false);
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_cmbDormitorio, "combo que seleciona o numero de dormitorios")) return (false);
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_cmbBairro, "combo que seleciona o bairro")) return (false);
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_cmbGaragem, "combo que seleciona a necessidade de ter garagem")) return (false);
    if (! dispara_busca_dos_imoveis_localiza_elementos (dispara_busca_dos_imoveis_cmbValorFinal, "combo que seleciona o valor maximo do aluguel")) return (false);
    return (true);
}

function dispara_busca_dos_imoveis_btn_click () {
    var botaum = document.getElementById ("dispara_busca_dos_imoveis_btn");
    if (! botaum.disabled) {
        if (dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbTipo, dispara_busca_dos_imoveis_strings_tipo[0], true)) {
            botaum.disabled = true;
            botaum.value = "Disparando buscas dos imoveis...";
            dispara_busca_dos_imoveis_contaTipo = 0;
            dispara_busca_dos_imoveis_contaDormitorio = 0;
            dispara_busca_dos_imoveis_contaBairro = 0;
            window.setTimeout (dispara_busca_dos_imoveis_interacao, dispara_busca_dos_imoveis_timeout);
        }
    }
}

function dispara_busca_dos_imoveis_interacao () {
    var cmbtipo, cmbbairro, cmbdormitorio, botaum, dormi, opti;
    cmbdormitorio = document.getElementById (dispara_busca_dos_imoveis_cmbDormitorio);
    if (dispara_busca_dos_imoveis_contaBairro >= dispara_busca_dos_imoveis_strings_bairro.length) {
        // Acabou os bairros. Passar para o proximo tipo
        dispara_busca_dos_imoveis_contaBairro = 0;
        dispara_busca_dos_imoveis_contaTipo++;
        if (dispara_busca_dos_imoveis_contaTipo >= dispara_busca_dos_imoveis_strings_tipo.length) {
            // Acabou os tipos. Fim da interacao
            var botaum = document.getElementById ("dispara_busca_dos_imoveis_btn");
            botaum.disabled = false;
            botaum.value = 'Disparar buscas de imoveis';
            window.alert ("Concluido.");
            return;
        } else if (! dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbTipo, dispara_busca_dos_imoveis_strings_tipo[dispara_busca_dos_imoveis_contaTipo], true)) {
            dispara_busca_dos_imoveis_contaBairro = dispara_busca_dos_imoveis_strings_bairro.length;
        }
    } else if (dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbBairro, dispara_busca_dos_imoveis_strings_bairro[dispara_busca_dos_imoveis_contaBairro], false)) {
        if (dispara_busca_dos_imoveis_contaDormitorio >= cmbdormitorio.options.length) {
            // Acabou os dormitorios. Passar para o proximo bairro
            dispara_busca_dos_imoveis_contaDormitorio = 0;
            dispara_busca_dos_imoveis_contaBairro++;
        } else {
            opti = cmbdormitorio.options[dispara_busca_dos_imoveis_contaDormitorio];
            dispara_busca_dos_imoveis_contaDormitorio++;
            dormi = opti.text;
            if (dormi == "1" || dormi == "2" || dormi == "3" || dormi == "4" || dormi == "5" || dormi == "6" || dormi == "7" || dormi == "8" || dormi == "9") {
                opti.selected = true;
                window.setTimeout (dispara_busca_dos_imoveis_interacao_p2, dispara_busca_dos_imoveis_timeout);
                return;
            }
        }
    } else {
        dispara_busca_dos_imoveis_contaDormitorio = 0;
        dispara_busca_dos_imoveis_contaBairro++;
    }
    window.setTimeout (dispara_busca_dos_imoveis_interacao, dispara_busca_dos_imoveis_timeout);
}

function dispara_busca_dos_imoveis_interacao_p2 () {
    var frm, evt;
    frm = document.getElementById (dispara_busca_dos_imoveis_formulario);
    frm.target = '_blank';
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.getElementById(dispara_busca_dos_imoveis_btmPesquisa).dispatchEvent (evt);
    window.setTimeout (dispara_busca_dos_imoveis_interacao, dispara_busca_dos_imoveis_timeout);
}

function dispara_busca_dos_imoveis_sel_item (combo, item, alerta) {
    var frm, i;
    frm = document.getElementById (combo);
    if (frm) {
        if (frm.options[frm.options.selectedIndex].text.toLowerCase().indexOf(item) == 0) {
            return (true);
        }
        for (i = frm.options.length - 1; i >= 0; i--) {
            if (frm.options[i].text.toLowerCase().indexOf(item) == 0) {
                frm.options[i].selected = true;
                return (true);
            }
        }
    }
    if (alerta) {
        window.alert ("Opcao '" + item + "' nao foi encontrada no combo '" + combo + "'!");
    }
    return (false);
}

function dispara_busca_dos_imoveis_onload_func () {
    var cidi, valor, i, evt, nobj, frm, oradio, naodeu;
    naodeu = document.getElementById ("WucGridResultado1_lblResultadoConsulta");
    if (naodeu) {
        if (naodeu.innerHTML == "Não foram encontrados imóveis para esta seleção.") {
            window.close ();
            return;
        }
    }
    if (dispara_busca_dos_imoveis_teste_sanidade ()) {
        oradio = document.getElementById(dispara_busca_dos_imoveis_radiolocacao);
        if (oradio.checked) {
            cidi = document.getElementById(dispara_busca_dos_imoveis_cmbCidade);
            if (cidi.options.length > 0) {
                valor = cidi.options[cidi.selectedIndex].text;
                if (valor.toLowerCase().indexOf("porto alegre") != 0) {
                    if (window.confirm ("Deseja selecionar a cidade de Porto Alegre?")) {
                        for (i = cidi.options.length - 1; i >= 0; i--) {
                            if (cidi.options[i].text.toLowerCase().indexOf("porto alegre") == 0) {
                                cidi.options[i].selected = true;
                                if (window.location.hash == dispara_busca_dos_imoveis_automatico_str) {
                                    frm = document.getElementById (dispara_busca_dos_imoveis_formulario);
                                    frm.action += dispara_busca_dos_imoveis_automatico_str;
                                }
                                evt = document.createEvent("UIEvents");
                                evt.initUIEvent("change", true, true, window, 1);
                                cidi.dispatchEvent (evt);
                                break;
                            }
                        }
                        if (i < 0) {
                            window.alert ("Nao foi possivel selecionar a cidade de Porto Alegre no formulario!");
                        }
                    }
                    return;
                }
                nobj = document.createElement ("input");
                nobj.id = "dispara_busca_dos_imoveis_btn";
                nobj.type = 'button';
                nobj.value = 'DISPARAR BUSCAS DE IMOVEIS';
                nobj.addEventListener ("click", function (event) {
                    if (dispara_busca_dos_imoveis_teste_sanidade ()) {
                        dispara_busca_dos_imoveis_btn_click ()
                    }
                }, true);
                frm = document.getElementById (dispara_busca_dos_imoveis_formulario);
                frm.target = '_blank';
                frm.insertBefore (nobj, frm.firstChild);
                // dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbGaragem, "com garagem", true);
                dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbGaragem, "indiferente...", true);
                dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbValorInicial, "0", true);
                dispara_busca_dos_imoveis_sel_item (dispara_busca_dos_imoveis_cmbValorFinal, "1.000,00", true);
                if (window.location.hash == dispara_busca_dos_imoveis_automatico_str) {
                    window.setTimeout (dispara_busca_dos_imoveis_btn_click, 5000);
                }
            }
        } else {
            if (window.location.hash == dispara_busca_dos_imoveis_automatico_str) {
                frm = document.getElementById (dispara_busca_dos_imoveis_formulario);
                frm.action += dispara_busca_dos_imoveis_automatico_str;
            }
            if (window.location.hash == dispara_busca_dos_imoveis_automatico_str || window.confirm ("Deseja selecionar a opcao de locacao?")) {
                evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                oradio.dispatchEvent (evt);
            }
        }
    }
}

window.addEventListener ("load", dispara_busca_dos_imoveis_onload_func, true);
