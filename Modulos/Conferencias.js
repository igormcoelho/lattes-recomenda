const fs = require('fs'),
      stringSimilarity = require('string-similarity');
let   conferenciasQualis, conferenciasLattes, conferenciaLattes = {}, conferenciaQualis = {}, conferenciasEncontradas = [], conferenciasNaoEncontradas = [], 
      flag, cont, jsonLattesObj,
      conferenciasTxt = "./conferencias.txt";


const Parse = require('./ParseData');


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    //this.parsePdfToTxt(config.arquivoConferencias, callback);
    let parse = new Parse();

    jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
        
    this.informaProducao(jsonLattesObj);
    this.verificaArquivosCriados();
}


Conferencia.prototype.informaProducao = function () {

    conferenciasLattes = obtemConferenciasLattes(jsonLattesObj);
    obtemConferenciasQualis();
}


Conferencia.prototype.verificaArquivosCriados = function() {

    if (fs.existsSync("./resultado_conferencias_encontradas.txt")) {
        console.log("Arquivo com conferências encontradas criado."); 
    }

    if (fs.existsSync("./resultado_conferencias_nao_encontradas.txt")) {
        console.log("Arquivo com conferências não encontradas criado."); 
    }
}


obtemConferenciasLattes = function(jsonLattesObj) {
    
    return jsonLattesObj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['TRABALHOS-EM-EVENTOS']['TRABALHO-EM-EVENTOS'];
}


obtemConferenciasQualis = function () {

    fs.readFile(conferenciasTxt, 'utf8', function(err, data) {

        if (err) throw err;        
        conferenciasQualis = data.toString().split("\n");
        comparaConferencias(conferenciasLattes, conferenciasQualis);
    });
}    


function comparaConferencias() {

    for (var i in conferenciasLattes) {   

        cont = 0; flag = false;        
        for (var j in conferenciasQualis) {

            getInfosConferenciaLattes(conferenciasLattes[i]);
            getInfosConferenciaQualis(conferenciasQualis[j]);
            var similarity = stringSimilarity.compareTwoStrings(conferenciaLattes.nome, conferenciaQualis.nome); 
            salvaConferenciasEncontradas(similarity);
            cont++;
            salvaConferenciasNaoEncontradas(cont, flag);
        }    
    }
}


function getInfosConferenciaLattes(eventoLattes) {

    conferenciaLattes.nome = eventoLattes['DETALHAMENTO-DO-TRABALHO']['_attributes']['NOME-DO-EVENTO'].toUpperCase();
    conferenciaLattes.tituloTrabalho = eventoLattes['DADOS-BASICOS-DO-TRABALHO']['_attributes']['TITULO-DO-TRABALHO'];
}


function getInfosConferenciaQualis(linha) {

    // Remove os ultimos 2 caracteres da string. ex: B1
    conferenciaQualis.nome = linha.slice(0, linha.length-2).toUpperCase();
    conferenciaQualis.conceito = linha.slice(-2);
    var n = conferenciaQualis.nome.indexOf(" -");
    conferenciaQualis.nome = conferenciaQualis.nome.substring(n/2);
}


function salvaConferenciasEncontradas(similarity) {

    if ( similarity >= 0.8 ) {

        conferenciasEncontradas.push(
            "\nEvento no Lattes: " + conferenciaLattes.nome, 
            "\nEvento no Qualis: " + conferenciaQualis.nome, 
            "\nNome do Trabalho: " + conferenciaLattes.tituloTrabalho, 
            "\nQualis do Evento: " + conferenciaQualis.conceito, 
            "\nGrau Similaridade: " + similarity + 
            "\n________________________________________________________________________________________________"
        );

        salvaInfosEmArquivo("./resultado_conferencias_encontradas.txt", conferenciasEncontradas);
        
        flag = true;
    } 
}


function salvaConferenciasNaoEncontradas(cont, flag) {

    if ( cont === conferenciasQualis.length && flag === false ) {
        
        conferenciasNaoEncontradas.push(
            "\nConferência não encontrada na base do Qualis", 
            "\nNome da Conferência: " + conferenciaLattes.nome, 
            "\nNome do Trabalho: " + conferenciaLattes.tituloTrabalho + 
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
