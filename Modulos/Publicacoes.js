var fs = require('fs'),
    convert = require('xml-js'),
    arquivoLattes, arquivoQualis, dadosArtigo = [], artigos, cont = 0, data = { artigos: [] },
    jsonfile = require('jsonfile');


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
    this.xlsToJson(config.classificacoesPublicadas, callback);
    this.xmlToJson(config.curriculoLattes);
    this.informaProducao(config.anoInicial, config.anoFinal);
}


Publicacao.prototype.xlsToJson = function(classificacoesPublicadas) {
    require("sheet2json")(classificacoesPublicadas, response => {
        var json = JSON.stringify(response, null, " ");
        arquivoQualis = "./classificacoes_publicadas.json";
        fs.writeFile(arquivoQualis, json, (err) => {
          if (err) {
            console.error(err)
            return
          }
        })
    });
}

Publicacao.prototype.xmlToJson = function (curriculoLattes) {
    var xml = fs.readFileSync(curriculoLattes, 'utf8'),
    options = {
        ignoreComment: true, alwaysChildren: true, compact: true, addParent: true, spaces: 2
    },
    result = convert.xml2json(xml, options); 

    arquivoLattes = "./curriculo-lattes.json";
    fs.writeFile(
        arquivoLattes, 
        result, 
        function(err) {
          if(err) {
            return console.log(err);
          }
        }  
    ); 
}

Publicacao.prototype.informaProducao = function(anoInicial, anoFinal) {
    jsonfile.readFile(arquivoLattes, function (err, obj) {
        if (err) console.error(err)
        retornaArtigosNoIntervalo(obj, anoInicial, anoFinal);
        verificaQuantidadeArtigos();
    });
    jsonfile.readFile(arquivoQualis, function (err, dadosQualis) {
        if (err) console.error(err)
        verificaISSN(dadosQualis);
    });        
}

function retornaArtigosNoIntervalo(obj, anoInicial, anoFinal) {
    var artigo = {};

    artigos = obj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['ARTIGOS-PUBLICADOS']['ARTIGO-PUBLICADO'];

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
}

function verificaQuantidadeArtigos() {
    if (artigos.length === cont) {
        console.log("Não há artigos para o intervalo informado.")
    }
}

function verificaISSN(dadosQualis) {
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
                salvaDadosdaProducaoemArquivo();
                break;
            }
        }
    }
}

function salvaDadosdaProducaoemArquivo() {
    var json = JSON.stringify(data, null, " ");
    fs.writeFile ("./artigos-com-estrato-por-periodico.json", json, function(err) {
        if (err) throw err;
    });
}
