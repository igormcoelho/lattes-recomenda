var fs = require('fs'),
    jsonLattesObj, jsonQualisObj,
    dadosArtigo = [], artigos, cont = 0, data = { artigos: [] };


const Parse = require('./ParseData');
const dados = require('./Dados');


exports = module.exports.AvaliacaoPublicacao = AvaliacaoPublicacao


function AvaliacaoPublicacao(config, callback) {

    if (!config.classificacoesPublicadas) {

        callback(new Error("Você não informou o arquivo xls de entrada."), null);
        
    } else if (!config.curriculoLattes) {

        callback(new Error("Você não informou o arquivo xml de entrada."), null);
    
    }

    new Publicacao(config, callback);
}
    

function Publicacao(config, callback) { 

    let parse = new Parse();

    jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
    jsonQualisObj = parse.parseXlsToJson(config.classificacoesPublicadas, callback);
    
    this.informaProducao(dados, jsonLattesObj, config.anoInicial, config.anoFinal);
    this.salvaProducao();
}


Publicacao.prototype.informaProducao = function (dados, jsonLattesObj, anoInicial, anoFinal) {
    
    artigos = dados.retornaLattesArtigos(jsonLattesObj);
    obtemArtigosNoIntervalo(artigos, anoInicial, anoFinal);
    // return ... lista de produções
}


Publicacao.prototype.salvaProducao = function() {

    verificaISSN(jsonQualisObj);
    verificaSeArquivoFoiCriado();
}


obtemArtigosNoIntervalo = function (artigos, anoInicial, anoFinal) {

    var artigo = {};

    for (var i in artigos) {

        artigo.ano = artigos[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["ANO-DO-ARTIGO"];
       
        if (anoInicial <= artigo.ano && anoFinal >= artigo.ano) {

            artigo.titulo = artigos[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["TITULO-DO-ARTIGO"];
            artigo.issn = artigos[i]['DETALHAMENTO-DO-ARTIGO']["_attributes"]["ISSN"];
            var obj = {
                'titulo': artigo.titulo,
                'ano': artigo.ano,
                'issn': artigo.issn
            }

            dadosArtigo.push(obj);
        }
        else {
            cont++;
        }
    }    

    verificaQuantidadeArtigos(artigos);
}


verificaQuantidadeArtigos = function (artigos) {

    if (artigos.length === cont) {
        console.log("Não há artigos para o intervalo informado.")
    }
}


verificaISSN = function (dadosQualis) {

    var  periodico = {}, objArtigo = {};

    for (var i in dadosArtigo) {

        for (var j in dadosQualis) {

            periodico.issn = dadosQualis[j]['ISSN'];
            periodico.issn = periodico.issn.split('-').join('');
            periodico.titulo = dadosQualis[j]['Título'];
            periodico.conceito = dadosQualis[j]['Estrato'];

            if (periodico.issn == dadosArtigo[i].issn) {
                
                objArtigo = {
                    'tituloDoArtigo': dadosArtigo[i].titulo,
                    'anoDoArtigo': dadosArtigo[i].ano,
                    'issnDoArtigo': dadosArtigo[i].issn,
                    'tituloDoPeriodico': periodico.titulo, 
                    'conceitoDoPeriodico': periodico.conceito
                }

                data.artigos.push(objArtigo);
                dados.escreveJsonObj("./resultado_artigos_com_conceito.json", data);
                break;
            }
        }
    }
}


function verificaSeArquivoFoiCriado() {

    if (fs.existsSync('./resultado_artigos_com_conceito.json')) {
        console.log("Arquivo de avaliação de publicações criado com sucesso."); 
    }
}