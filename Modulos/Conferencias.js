
const dados = require('./Dados');

module.exports = {
    AvaliacaoConferencia: AvaliacaoConferencia,
    cruzaDadosEve: cruzaDadosEve
}    


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    const Parse = require('./ParseData');
    
    let parse = new Parse();

    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
    let conferenciasLattes = dados.retornaLattesEventos(jsonLattesObj);
    let conferenciasQualis = dados.retornaJsonObj("../Arquivos/qualis_eventos_cc_2016.json");

    dados.retornaDadosPesquisador(jsonLattesObj, 'Avaliação de conferências');
    cruzaDadosEve(conferenciasLattes, conferenciasQualis.conferencias, config.anoInicial, config.anoFinal, config.similaridade, 'conferencia');
}


function cruzaDadosEve(conferenciasLattes, conferenciasQualis, anoInicial, anoFinal, similaridade, origem) {

    let stringSimilarity = require('string-similarity');
    let conferenciaLattes = {}, conferenciaQualis = {}, conferenciasEncontradas = [], conferenciasNaoEncontradas = [], qualis = [];
    let flag, cont;

    for ( var i in conferenciasLattes ) {  
        
        dados.getInfosConferenciaLattes(conferenciaLattes, conferenciasLattes[i]);

        if ( conferenciaLattes.anoTrabalho >= anoInicial && conferenciaLattes.anoTrabalho <= anoFinal ) {

            cont = 0; flag = false; 
            var maiorSimilaridade = 0, conferencia = {};

            for ( var j in conferenciasQualis ) {

                dados.getInfosConferenciaQualis(conferenciaQualis, conferenciasQualis[j]);
                
                var resultadoSimilaridade = stringSimilarity.compareTwoStrings(conferenciaLattes.nome, conferenciaQualis.nome); 
                
                if ( resultadoSimilaridade >= similaridade ) {

                    if ( resultadoSimilaridade > maiorSimilaridade ) maiorSimilaridade = resultadoSimilaridade;

                    dados.preencheObjConferencia(conferencia, conferenciaLattes, conferenciaQualis, maiorSimilaridade);
                    flag = true;
                } 
                
                cont++;
                
                dados.salvaConferenciasNaoEncontradas(conferenciasNaoEncontradas, conferenciaLattes, conferenciasQualis, cont, flag, resultadoSimilaridade);
            }      

            if ( conferencia.similaridade ) {

                conferenciasEncontradas.push(conferencia);
                qualis.push(conferencia.qualis);
                // if ( origem == 'conferencia' ) dados.escreveJsonObj("./resultado_conferencias_encontradas.json", conferenciasEncontradas);
            }
        }
    }

    if ( conferenciasEncontradas.length == 0 && conferenciasNaoEncontradas.length == 0 ) {

        if ( origem == 'indice' ) {
            console.log('Não há conferências publicadas nos últimos quatro anos.');
        } else {
            console.log('Não há conferências para o intervalo informado.');
        }

    } else { 

        dados.verificaLista(conferenciasEncontradas, 'CONFERÊNCIAS ENCONTRADAS');
        dados.verificaLista(conferenciasNaoEncontradas, 'CONFERÊNCIAS NÃO ENCONTRADAS');
    }

    if ( origem == 'indice' ) return qualis;
}
