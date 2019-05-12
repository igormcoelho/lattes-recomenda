const fs = require('fs'),
      pdf = require('pdf-parse'),
      convert = require('xml-js'),
      jsonfile = require('jsonfile'),
      stringSimilarity = require('string-similarity');
let   conferenciasQualis = [], conferenciasLattes, conferenciaLattes = {}, conferenciaQualis = {}, conferenciasEncontradas = [], conferenciasNaoEncontradas = [], flag, cont,
      lattesJson = "./curriculo_lattes.json",
      conferenciasTxt = "./conferencias.txt";


exports = module.exports.AvaliacaoConferencia = AvaliacaoConferencia


function AvaliacaoConferencia(config, callback) {
    
    new Conferencia(config, callback);
}


function Conferencia(config, callback) {

    //this.parsePdfToTxt(config.arquivoConferencias, callback);
    this.parseXmlToJson(config.arquivoLattes);
    this.salvaConferencias();
    this.verificaArquivosCriados();
}


Conferencia.prototype.parsePdfToTxt = function(arquivoConferencias) {

    let file = fs.readFileSync(arquivoConferencias, { encoding: 'utf8' });
    
    pdf(file).then(function(data) {
        try {
            fs.writeFileSync(
                conferenciasTxt, 
                data.text
            );
        } catch(e) {
            console.log("Erro na conversão de pdf para txt: " + err);
        }
    });
}


Conferencia.prototype.parseXmlToJson = function(arquivoLattes) {
    
    var xml = fs.readFileSync(arquivoLattes, 'utf8'),
        options = {
            ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
        },
        result = convert.xml2json(xml, options);

        fs.writeFileSync(lattesJson, result, (err) => {
            if(err) return console.log("Erro na criação de curriculo em json: " + err);
        });     
}


Conferencia.prototype.salvaConferencias = function() {
    
    jsonfile.readFile(lattesJson, function (err, obj) {
        if (err) console.error("Erro na leitura de currículo em json: " + err)
        conferenciasLattes = obj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['TRABALHOS-EM-EVENTOS']['TRABALHO-EM-EVENTOS'];
        salvaConferenciaQualis();
    });
}


Conferencia.prototype.verificaArquivosCriados = function() {

    if (fs.existsSync("./resultado_conferencias_encontradas.txt")) {
        console.log("Arquivo com resultados criado com sucesso."); 
    }
}


function salvaConferenciaQualis() {
    
    fs.readFile(conferenciasTxt, 'utf8', function(err, data) {
        if (err) throw err;        
        conferenciasQualis = data.toString().split("\n");
        comparaConferencias(conferenciasLattes, conferenciasQualis);
    });
}


function comparaConferencias(conferenciasLattes, conferenciasQualis) {

    for (var i in conferenciasLattes) {   

        cont = 0; flag = false;        
        for (var j in conferenciasQualis) {

            getInfosConferenciaLattes(conferenciasLattes[i]);
            getInfosConferenciaQualis(conferenciasQualis[j]);
            var similarity = stringSimilarity.compareTwoStrings(conferenciaLattes.nome, conferenciaQualis.nome); 
            checaSimilaridade(similarity);
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


function checaSimilaridade(similarity) {

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
    })  
}