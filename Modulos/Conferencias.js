const fs = require('fs');
let flag, cont;


const Parse = require('./ParseData');
const Dados = require('./Dados');


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    let parse = new Parse();
    let dados = new Dados();

    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
        
    let conferenciasLattes = dados.retornaLattesEventos(jsonLattesObj);
    
    let conferenciasQualis = dados.retornaJsonObj("../Arquivos/qualis_eventos_cc_2016.json");

    this.comparaConferencias(conferenciasLattes, conferenciasQualis, config.anoInicial, config.anoFinal, config.similaridade)
    
    // this.verificaArquivosCriados();
}


Conferencia.prototype.comparaConferencias = function (conferenciasLattes, conferenciasQualis, anoInicial, anoFinal, similaridade) { 
    
    
    let stringSimilarity = require('string-similarity'),
        conferenciaLattes = {}, conferenciaQualis = {}, conferenciasEncontradas = [], conferenciasNaoEncontradas = [];
    
    for (var i in conferenciasLattes) {  
        
        getInfosConferenciaLattes(conferenciaLattes, conferenciasLattes[i]);

        if (conferenciaLattes.anoTrabalho >= anoInicial && conferenciaLattes.anoTrabalho <= anoFinal) {

            cont = 0; flag = false; 
            var maiorSimilaridade = 0, conferencia = {};

            for (var j in conferenciasQualis) {

                getInfosConferenciaQualis(conferenciaQualis, conferenciasQualis[j]);
                
                var resultadoSimilaridade = stringSimilarity.compareTwoStrings(conferenciaLattes.nome, conferenciaQualis.nome); 
                
                if ( resultadoSimilaridade >= similaridade ) {

                    if ( resultadoSimilaridade > maiorSimilaridade ) {
                        maiorSimilaridade = resultadoSimilaridade;
                    }

                    preencheObjConferencia(conferencia, conferenciaLattes, conferenciaQualis, maiorSimilaridade);
                    
                    flag = true;
                } 
                
                cont++;
                
                salvaConferenciasNaoEncontradas(conferenciasNaoEncontradas, conferenciaLattes, conferenciaQualis, conferenciasQualis, cont, flag, resultadoSimilaridade);
            }      

            if ( conferencia.similaridade ) {
                conferenciasEncontradas.push(conferencia);
                salvaInfosEmArquivo("./resultado_conferencias_encontradas.json", conferenciasEncontradas);
            }
        }
    }
}


function getInfosConferenciaLattes(conferenciaLattes, indice) {

    conferenciaLattes.nome = indice['DETALHAMENTO-DO-TRABALHO']['_attributes']['NOME-DO-EVENTO'].toUpperCase();
    conferenciaLattes.tituloTrabalho = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['TITULO-DO-TRABALHO'];
    conferenciaLattes.anoTrabalho = indice['DADOS-BASICOS-DO-TRABALHO']['_attributes']['ANO-DO-TRABALHO'];
}


function getInfosConferenciaQualis(conferenciaQualis, indice) {

    conferenciaQualis.nome = indice.nome.toUpperCase();
    conferenciaQualis.sigla = indice.sigla;
    conferenciaQualis.conceito = indice.qualis;
}


Conferencia.prototype.verificaArquivosCriados = function() {

    if (fs.existsSync("./resultado_conferencias_encontradas.txt")) {
        console.log("Arquivo com conferências encontradas criado."); 
    }

    if (fs.existsSync("./resultado_conferencias_nao_encontradas.txt")) {
        console.log("Arquivo com conferências não encontradas criado."); 
    }
}


function preencheObjConferencia(conferencia, conferenciaLattes, conferenciaQualis, maiorSimilaridade) {

    conferencia.nomeTrabalho = conferenciaLattes.tituloTrabalho; 
    conferencia.eventoLattes = conferenciaLattes.nome; 
    conferencia.eventoQualis = conferenciaQualis.nome; 
    conferencia.ano = conferenciaLattes.anoTrabalho;
    conferencia.qualis = conferenciaQualis.conceito; 
    conferencia.similaridade = maiorSimilaridade; 
}


function salvaConferenciasNaoEncontradas(conferenciasNaoEncontradas, conferenciaLattes, conferenciaQualis, conferenciasQualis, cont, flag, resultadoSimilaridade) {

    let conferencia = {};

    if ( cont == conferenciasQualis.length && flag == false ) {
        
        conferencia.nomeTrabalho = conferenciaLattes.tituloTrabalho; 
        conferencia.eventoLattes = conferenciaLattes.nome; 
        conferencia.ano = conferenciaLattes.anoTrabalho;
        // conferencia.similaridade = String(resultadoSimilaridade);

        conferenciasNaoEncontradas.push(conferencia);
        salvaInfosEmArquivo("./resultado_conferencias_nao_encontradas.json", conferenciasNaoEncontradas);
    }   
}


function salvaInfosEmArquivo(caminhoArquivo, data) {

    var data = JSON.stringify(data, null, " ");

    fs.writeFileSync(caminhoArquivo, data, function(err) {
        
        if(err) return console.log("Erro na criação de arquivo com resultado final: " + err);
        console.log('Arquivo gerado com sucesso.');
    })  
}
