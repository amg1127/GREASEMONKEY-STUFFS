// ==UserScript==
// @name           Cadastrar alerta ZAP
// @namespace      http://localhost
// @description    Maneira de automatizar o cadastro de alertas do ZAP
// @include        http://www.zap.com.br/imoveis/cadastro-alerta.aspx*
// ==/UserScript==

var alertazap_poscampo, alertazap_campos, alertazap_listacampos, alertazap_tentadenovo, alertazap_ultimoIncremento;
var alertazap_filajanela, alertazap_janelatimer, alertazap_fecharjanela;

function alertazap_timeout () {
    return (Math.round(Math.random() * 3500 + 500));
}

function alertazap_onload () {
    var loca, matri, i, uarr, p;
    loca = window.location.hash;
    document.cookies = "";
    if (loca.substring (0, 1) == "#") {
        loca = loca.substring (1);
    }
    alertazap_filajanela = new Array ();
    alertazap_janelatimer = 0;
    alertazap_fecharjanela = false;
    alertazap_ultimoIncremento = 0;
    if (loca.toLowerCase() == "criacadastros") {
        alertazap_passo1 ();
    } else if (loca.substring (0, 13) == "criacadastro-") {
        loca = loca.substring (13);
        matri = loca.split ("&");
        l = matri.length;
        for (i = matri.length - 1; i >= 0; i--) {
            uarr = matri[i].split ("=");
            matri[i] = new Array ();
            if (uarr.length == 2 || uarr.length == 3) {
                matri[i][0] = unescape (uarr[0]);
                matri[i][1] = unescape (uarr[1]);
                if (uarr.length == 3) {
                    p = parseInt (unescape (uarr[2]), 10);
                    if (isNaN (p)) {
                        window.alert ("Erro[2] ao analisar parametros de entrada!");
                        return;
                    }
                    if (p < 0) {
                        window.alert ("Erro[3] ao analisar parametros de entrada!");
                        return;
                    }
                    matri[i][2] = p;
                }
            } else {
                window.alert ("Erro[1] ao analisar parametros de entrada!");
                return;
            }
        }
        alertazap_poscampo = -1;
        alertazap_campos = matri;
        if (alertazap_sanidade ()) {
            window.setTimeout (alertazap_passo3, alertazap_timeout ());
        }
    }
}

function alertazap_processafila () {
    var arrtmp, fstjan, i;
    if (alertazap_filajanela.length) {
        arrtmp = new Array ();
        fstjan = alertazap_filajanela[0];
        for (i = alertazap_filajanela.length - 1; i > 0; i--) {
            arrtmp[i-1] = alertazap_filajanela[i];
        }
        alertazap_filajanela = arrtmp;
        window.open (fstjan);
        alertazap_janelatimer = window.setTimeout (alertazap_processafila, alertazap_timeout ());
    } else {
        alertazap_janelatimer = 0;
        if (alertazap_fecharjanela) {
            window.close ();
            window.alert ("Feche esta janela!");
        } else {
            window.alert ("Pronto.\nFeche esta janela.");
        }
    }
}

function alertazap_vianome (nome, unico) {
    var lstElems;
    lstElems = document.getElementsByName (nome);
    if (unico && lstElems.length == 1) {
        return (lstElems[0]);
    } else if ((! unico) && lstElems.length > 1) {
        return (lstElems);
    } else {
        return (null);
    }
}

function alertazap_localizacampo (nome) {
    var i;
    for (i = alertazap_listacampos.length - 1; i >= 0; i--) {
        if (alertazap_listacampos[i][0] == nome) {
            return (alertazap_listacampos[i]);
        }
    }
    return (null);
}

function alertazap_estahabilitado (nome) {
    var elem, resp;
    elem = alertazap_localizacampo (nome);
    if (elem) {
        if (elem[3]) {
            return (! elem[1].disabled);
        } else {
            resp = false;
            for (i = elem[1].length - 1; i >= 0; i--) {
                resp = (resp || elem[1][i].disabled);
            }
            return (! resp);
        }
    }
    return (false);
}

function alertazap_invocachanged (elem) {
    var evt;
    evt = document.createEvent ("HTMLEvents");
    evt.initEvent ("change", true, true);
    elem.dispatchEvent (evt);
}

function alertazap_definevalor (nome, valor, posic) {
    var elem, nomereal, i, l, seleiguals, ll;
    elem = alertazap_localizacampo (nome);
    if (elem) {
        if (elem[3]) {
            if (elem[1].type == 'text') {
                elem[1].value = valor;
                return (0);
            } else if (elem[1].type == 'select-one') {
                l = elem[1].options.length;
                seleiguals = new Array ();
                ll = 0;
                for (i = 0; i < l; i++) {
                    if (alertazap_ehstringigual (elem[1].options[i].text, valor)) {
                        seleiguals[ll++] = elem[1].options[i];
                    }
                }
                if (ll == 0) {
                    window.alert ("Opcao de valor '" + valor + "' nao foi encontrada na caixa de selecao de nome '" + nome + "'!");
                } else {
                    if (ll == 1 && (! posic)) {
                        i = 0;
                    } else if (ll > 1 && posic) {
                        i = posic - 1;
                        if (i >= ll) {
                            window.alert ("Erro[7] ao definir o valor '" + valor + "' para o campo de nome '" + nome + "'!");
                            i = -1;
                        }
                    } else {
                        // window.alert ("Erro[6] ao definir o valor '" + valor + "' para o campo de nome '" + nome + "'!");
                        i = -1;
                    }
                    if (i >= 0) {
                        seleiguals[i].selected = true;
                        alertazap_invocachanged (elem[1]);
                        return (0);
                    } else {
                        return (ll);
                    }
                }
            } else {
                window.alert ("Erro[5] ao definir o valor '" + valor + "' para o campo de nome '" + nome + "'!");
            }
        } else {
            for (i = elem[1].length - 1; i >= 0; i--) {
                if (elem[1][i].type == 'radio') {
                    if (elem[4][i]) {
                        if (alertazap_ehstringigual (elem[4][i].textContent, valor)) {
                            elem[1][i].checked = true;
                            return (0);
                        }
                    }
                }
            }
            if (i < 0) {
                window.alert ("Campo de valor '" + valor + "' nao foi encontrado nos campos de nome '" + nome + "'!");
            }
        }
    } else {
        window.alert ("Campo de nome '" + nome + "' nao encontrado!");
    }
    return (-1);
}

function alertazap_testaeadiciona (rotulo, nome, tipo, unico) {
    var oelem, oprim, novo, i, l, rotlow;
    oelem = alertazap_vianome (nome, unico);
    if (! oelem) {
        window.alert ("Campo '" + nome + "' do formulario ZAP nao foi encontrado!");
        return (false);
    }
    if (unico) {
        oprim = oelem;
    } else {
        oprim = oelem[0];
    }
    if (! oprim.type) {
        window.alert ("Tipo do campo '" + nome + "' do formulario ZAP nao esta definido!");
        return (false);
    }
    if (oprim.type != tipo) {
        window.alert ("Tipo do campo '" + nome + "' eh '" + oprim.type + "', mas era esperado '" + tipo + "'!");
        return (false);
    }
    novo = new Array ();
    novo[0] = rotulo;
    novo[1] = oelem;
    novo[2] = tipo;
    novo[3] = unico;
    l = alertazap_listacampos.length;
    rotlow = rotulo.toLowerCase ();
    for (i = 0; i < l; i++) {
        if (alertazap_listacampos[i][0].toLowerCase() == rotlow) {
            window.alert ("Rotulo de campo repetido: '" + rotulo + "'");
            return (false);
        }
    }
    if (! unico) {
        if (tipo == "radio") {
            novo[4] = new Array ();
            oelem = document.getElementsByTagName ("LABEL");
            for (i = novo[1].length - 1; i >= 0; i--) {
                novo[4][i] = null;
                if (novo[1][i].id) {
                    for (l = oelem.length - 1; l >= 0; l--) {
                        if (oelem[l].htmlFor == novo[1][i].id) {
                            novo[4][i] = oelem[l];
                            break;
                        }
                    }
                }
            }
        }
    }
    alertazap_listacampos[alertazap_listacampos.length] = novo;
    return (true);
}

function alertazap_sanidade () {
    // Funcao que verifica se todos os campos que preciso existem
    alertazap_listacampos = new Array ();
    // Quero receber o alerta...
    if (! alertazap_testaeadiciona ("optRec", "ctl00$ContentPlaceHolder1$rbRecebimento", "radio", false)) { return (false); }
    // E-mail
    if (! alertazap_testaeadiciona ("txtEmail", "ctl00$ContentPlaceHolder1$txtEmailUsuario", "text", true)) { return (false); }
    // Frequencia do alerta
    if (! alertazap_testaeadiciona ("optFreq", "ctl00$ContentPlaceHolder1$rbFrequenciaAlerta", "radio", false)) { return (false); }
    // Nome do alerta
    if (! alertazap_testaeadiciona ("txtNomeAlerta", "ctl00$ContentPlaceHolder1$txtNomeAlerta", "text", true)) { return (false); }
    // Transação
    if (! alertazap_testaeadiciona ("optTrans", "ctl00$ContentPlaceHolder1$cboTransacao", "select-one", true)) { return (false); }
    // Tipo
    if (! alertazap_testaeadiciona ("optTipo", "ctl00$ContentPlaceHolder1$cboTipo", "select-one", true)) { return (false); }
    // SubTipo
    if (! alertazap_testaeadiciona ("optSubTipo", "ctl00$ContentPlaceHolder1$cboSubTipo", "select-one", true)) { return (false); }
    // Estado
    if (! alertazap_testaeadiciona ("optEstado", "ctl00$ContentPlaceHolder1$cboUF", "select-one", true)) { return (false); }
    // Cidade
    if (! alertazap_testaeadiciona ("optCidade", "ctl00$ContentPlaceHolder1$cboLocalidade", "select-one", true)) { return (false); }
    // Bairro
    if (! alertazap_testaeadiciona ("optBairro", "ctl00$ContentPlaceHolder1$cboDistrito", "select-one", true)) { return (false); }
    // Valor mínimo
    if (! alertazap_testaeadiciona ("txtMinVal", "ctl00$ContentPlaceHolder1$cboValorMinimo", "text", true)) { return (false); }
    // Valor máximo
    if (! alertazap_testaeadiciona ("txtMaxVal", "ctl00$ContentPlaceHolder1$cboValorMaximo", "text", true)) { return (false); }
    // Tudo OK!
    return (true);
}

function alertazap_ehstringigual (str1, str2) {
    var s1, s2;
    s1 = ' ' + str1 + ' ';
    s2 = ' ' + str2 + ' ';
    s1 = s1.replace(/\s+/, ' ').toLowerCase();
    s2 = s2.replace(/\s+/, ' ').toLowerCase();
    return (s1 == s2);
}

function alertazap_abrebairro (cidade, bairro, email, nomealerta) {
    alertazap_campos = new Array ();

    alertazap_campos[0] = new Array ();
    alertazap_campos[0][0] = "txtEmail";
    alertazap_campos[0][1] = email;

    alertazap_campos[1] = new Array ();
    alertazap_campos[1][0] = "txtNomeAlerta";
    alertazap_campos[1][1] = nomealerta + "a";

    alertazap_campos[2] = new Array ();
    alertazap_campos[2][0] = "optTipo";
    alertazap_campos[2][1] = "Apartamento";

    alertazap_campos[3] = new Array ();
    alertazap_campos[3][0] = "optSubTipo";
    alertazap_campos[3][1] = "Apartamento Padrão";

    alertazap_campos[4] = new Array ();
    alertazap_campos[4][0] = "optEstado";
    alertazap_campos[4][1] = "Rio de Janeiro";

    alertazap_campos[5] = new Array ();
    alertazap_campos[5][0] = "optCidade";
    alertazap_campos[5][1] = cidade;

    alertazap_campos[6] = new Array ();
    alertazap_campos[6][0] = "optBairro";
    alertazap_campos[6][1] = bairro;
    
    alertazap_openquery ();
    
    alertazap_campos[1][1] = nomealerta + "c";
    alertazap_campos[2][1] = "Casa";
    alertazap_campos[3][1] = "Casa Padrão";
    
    alertazap_openquery ();
}

function alertazap_openquery () {
    var endere, i, l, arrtmp, arrtmp2, ii, ll;
    l = alertazap_campos.length;
    arrtmp = new Array ();
    for (i = 0; i < l; i++) {
        arrtmp2 = new Array ();
        ll = alertazap_campos[i].length;
        for (ii = 0; ii < ll; ii++) {
            arrtmp2[ii] = escape (alertazap_campos[i][ii]);
        }
        arrtmp[i] = arrtmp2.join ("=");
    }
    if (window.location.hash) {
        endere = window.location.href.substring (0, window.location.href.length - window.location.hash.length);
        if (window.location.hash.substring (0, 1) == "#") {
            endere += "#";
        }
    } else {
        endere = window.location.href + "#";
    }
    endere += "criacadastro-" + arrtmp.join ("&");
    alertazap_filajanela[alertazap_filajanela.length] = endere;
    if (alertazap_janelatimer == 0) {
        alertazap_janelatimer = window.setTimeout (alertazap_processafila, alertazap_timeout ());
    }
}

function alertazap_passo1 () {
    if (alertazap_sanidade ()) {
        window.setTimeout (alertazap_passo2, alertazap_timeout ());
    }
}

function alertazap_passo2 () {
    var lbrio, lbnit, i, lenrio, lennit, lentot;
    lbrio = "aeroporto;botafogo;flamengo;leblon;copacabana;ipanema;saude;lapa;centro;cidade universitaria;gloria;urca;laranjeiras;catete;leme;humaita;gavea";
    lbnit = "ponta d areia;centro;fatima;cubango;icarai;inga;boa viagem;sao domingos";
    lbrio = lbrio.split (";"); // 16
    lbnit = lbnit.split (";"); // 8
    lenrio = lbrio.length;
    lennit = lbnit.length;
    lentot = 0;
    // Aqui da 24 alertas, mas so posso criar ate 20! Solucionar o problema com uma conta de e-mail nova...
    for (i = 0; i < lenrio; i++) {
        alertazap_abrebairro ("rio de janeiro", lbrio[i], "nonegziste@mailinator.com", "al" + (++lentot));
    }
    for (i = 0; i < lennit; i++) {
        alertazap_abrebairro ("niteroi", lbnit[i], "nonegziste@mailinator.com", "al" + (++lentot));
    }
}

function alertazap_passo3 () {
    var resp, elem, campo, i, nomeAlertaPos, nomeAlertaAtu;
    if (alertazap_poscampo < 0) {
        if (alertazap_definevalor ("optRec", "Somente por e-mail") == 0 &&
            alertazap_definevalor ("optFreq", "1 vez por dia") == 0 &&
            alertazap_definevalor ("optTrans", "Locação") == 0 &&
            alertazap_definevalor ("txtMinVal", "1") == 0 &&
            alertazap_definevalor ("txtMaxVal", "2.000") == 0) {
            alertazap_poscampo = 0;
            alertazap_ultimoIncremento = 0;
            alertazap_tentadenovo = 0;
            window.setTimeout (alertazap_passo3, alertazap_timeout ());
        }
    } else if (alertazap_poscampo < alertazap_campos.length) {
        elem = alertazap_campos[alertazap_poscampo];
        if (alertazap_estahabilitado (elem[0])) {
            if (elem.length == 2) {
                resp = alertazap_definevalor (elem[0], elem[1]);
            } else {
                resp = alertazap_definevalor (elem[0], elem[1], elem[2]);
            }
            if (resp == 0) {
                alertazap_ultimoIncremento = 0;
                alertazap_tentadenovo = 0;
                alertazap_poscampo++;
                window.setTimeout (alertazap_passo3, alertazap_timeout ());
            } else if (resp > 0 && elem.length == 2) {
                for (nomeAlertaPos = alertazap_campos.length - 1; nomeAlertaPos >= 0; nomeAlertaPos--) {
                    if (alertazap_campos[nomeAlertaPos][0] == "txtNomeAlerta") {
                        break;
                    }
                }
                if (nomeAlertaPos < 0) {
                    window.alert ("Onde esta o valor do campo 'txtNomeAlerta'?");
                    window.close ();
                } else if (alertazap_campos[nomeAlertaPos].length != 2) {
                    window.alert ("O campo 'txtNomeAlerta' nao deveria ser multivalorado!");
                    window.close ();
                } else {
                    nomeAlertaAtu = alertazap_campos[nomeAlertaPos][1];
                    for (i = 0; i < resp; i++) {
                        alertazap_campos[nomeAlertaPos][1] = nomeAlertaAtu + i;
                        alertazap_campos[alertazap_poscampo][2] = i + 1;
                        alertazap_openquery ();
                    }
                    alertazap_fecharjanela = true;
                }
            }
        } else {
            alertazap_ultimoIncremento++;
            if (alertazap_ultimoIncremento > 5) {
                if (alertazap_tentadenovo > 6) {
                    window.alert ("Erro de timeout ao esperar o campo '" + elem[0] + "' ativar! Abortando...");
                } else {
                    i = alertazap_tentadenovo;
                    alertazap_poscampo--;
                    alertazap_passo3 ();
                    alertazap_tentadenovo = i;
                }
            } else {
                window.setTimeout (alertazap_passo3, alertazap_timeout ());
            }
        }
    } else {
        window.alert ("Pronto. \\o/");
    }
}

window.addEventListener ("load", alertazap_onload, true);
GM_registerMenuCommand ("Disparar cadastro de alertas ZAP", alertazap_passo1);
