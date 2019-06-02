const fs = require('fs');
let flag, cont;


const Parse = require('./ParseData');
const Arquivos = require('./Arquivos');


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    let parse = new Parse();
    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
        
    let conferenciasLattes = this.getConferenciasLattes(jsonLattesObj);
    
    let arquivos = new Arquivos();
    let conferenciasQualis = arquivos.retornaJsonObj("../Arquivos/qualis_eventos_cc_2016.json");

    this.comparaConferencias(conferenciasLattes, conferenciasQualis.eventos, config.anoInicial, config.anoFinal, config.similaridade)
    
    // this.verificaArquivosCriados();
}


Conferencia.prototype.getConferenciasLattes = function (jsonLattesObj) {

    return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['TRABALHOS-EM-EVENTOS']['TRABALHO-EM-EVENTOS'];
}


Conferencia.prototype.comparaConferencias = function (conferenciasLattes, conferenciasQualis, anoInicial, anoFinal, similaridade) { 
    
    
    let stringSimilarity = require('string-similarity'),
        conferenciaLattes = {}, conferenciaQualis = {}, conferenciasEncontradas = [], conferenciasNaoEncontradas = [];
    
    for (var i in conferenciasLattes) {  
        
        getInfosConferenciaLattes(conferenciaLattes, conferenciasLattes[i]);

        if (conferenciaLattes.anoTrabalho >= anoInicial && conferenciaLattes.anoTrabalho <= anoFinal) {

            cont = 0; flag = false;     

            for (var j in conferenciasQualis) {

                getInfosConferenciaQualis(conferenciaQualis, conferenciasQualis[j]);
                
                var resultadoSimilaridade = stringSimilarity.compareTwoStrings(conferenciaLattes.nome, conferenciaQualis.nome); 
                
                salvaConferenciasEncontradas(conferenciasEncontradas, conferenciaLattes, conferenciaQualis, resultadoSimilaridade, similaridade);
                
                cont++;
                
                salvaConferenciasNaoEncontradas(conferenciasNaoEncontradas, conferenciaLattes, conferenciasQualis, cont, flag, resultadoSimilaridade);
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

    conferenciaQualis.nome = indice.conferenciaNome.toUpperCase();
    conferenciaQualis.sigla = indice.conferenciaSigla;
    conferenciaQualis.conceito = indice.conferenciaQualis;
}


Conferencia.prototype.verificaArquivosCriados = function() {

    if (fs.existsSync("./resultado_conferencias_encontradas.txt")) {
        console.log("Arquivo com conferências encontradas criado."); 
    }

    if (fs.existsSync("./resultado_conferencias_nao_encontradas.txt")) {
        console.log("Arquivo com conferências não encontradas criado."); 
    }
}


function salvaConferenciasEncontradas(conferenciasEncontradas, conferenciaLattes, conferenciaQualis, resultadoSimilaridade, similaridadeUsuario) {

    if ( resultadoSimilaridade >= similaridadeUsuario ) {

        conferenciasEncontradas.push(
            "\nEvento no Lattes: " + conferenciaLattes.nome, 
            "\nEvento no Qualis: " + conferenciaQualis.nome, 
            "\nNome do Trabalho: " + conferenciaLattes.tituloTrabalho, 
            "\nAno do Trabalho: " + conferenciaLattes.anoTrabalho,
            "\nQualis do Evento: " + conferenciaQualis.conceito, 
            "\nGrau Similaridade: " + resultadoSimilaridade + 
            "\n________________________________________________________________________________________________"
        );

        salvaInfosEmArquivo("./resultado_conferencias_encontradas.txt", conferenciasEncontradas);
        
        flag = true;
    } 
}


function salvaConferenciasNaoEncontradas(conferenciasNaoEncontradas, conferenciaLattes, conferenciasQualis, cont, flag, similarity) {

    if ( cont == conferenciasQualis.length && flag == false ) {
        
        conferenciasNaoEncontradas.push(
            "\nConferência não encontrada na base do Qualis", 
            "\nNome da Conferência: " + conferenciaLattes.nome, 
            "\nNome do Trabalho: " + conferenciaLattes.tituloTrabalho,
            "\nAno do Trabalho: " + conferenciaLattes.anoTrabalho, 
            "\nGrau Similaridade: " + similarity + 
            "\n________________________________________________________________________________________________"
        );

        salvaInfosEmArquivo("./resultado_conferencias_nao_encontradas.txt", conferenciasNaoEncontradas);
    }   
}


function salvaInfosEmArquivo(caminhoArquivo, data) {

    fs.writeFileSync(caminhoArquivo, data, function(err) {
        
        if(err) return console.log("Erro na criação de arquivo com resultado final: " + err);
        console.log('Arquivo gerado com sucesso.');
    })  
}
