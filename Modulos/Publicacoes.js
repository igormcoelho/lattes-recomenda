var fs = require('fs'),
    convert = require('xml-js'),
    sheet2json = require("sheet2json"),
    jsonfile = require('jsonfile'),
    arquivoLattes, arquivoQualis, dadosArtigo = [], artigos, cont = 0, data = { artigos: [] };


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
    this.salvaProducao();
}


Publicacao.prototype.xlsToJson = function(classificacoesPublicadas) {

    sheet2json(classificacoesPublicadas, response => {

        var json = JSON.stringify(response, null, " ");

        arquivoQualis = "./periodicos_conceito.json";

        fs.writeFileSync(arquivoQualis, json, (err) => {
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
    json = convert.xml2json(xml, options); 

    arquivoLattes = "./curriculo_lattes.json";

    fs.writeFileSync(arquivoLattes, json, (err) => {
            if(err) {
                return console.log("Erro na criação de curriculo em json: " + err);
            }
        }  
    ); 
}


Publicacao.prototype.informaProducao = function(anoInicial, anoFinal) {

    jsonfile.readFile(arquivoLattes, function (err, obj) {

        if (err) console.error("Erro na leitura de curriculo em json: " + err)
        artigos = obj['CURRICULO-VITAE']['PRODUCAO-BIBLIOGRAFICA']['ARTIGOS-PUBLICADOS']['ARTIGO-PUBLICADO'];
        
        retornaArtigosNoIntervalo(artigos, anoInicial, anoFinal);
        verificaQuantidadeArtigos();
    });
}


Publicacao.prototype.salvaProducao = function() {

    jsonfile.readFile(arquivoQualis, function (err, dadosQualis) {

        if (err) console.error("Erro na leitura dos periodicos em json: " + err)
        verificaISSN(dadosQualis);
        verificaSeArquivoFoiCriado();
    });        
}


function retornaArtigosNoIntervalo(artigos, anoInicial, anoFinal) {

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
                salvaDadosdaProducaoemArquivo(data);
                break;
            }
        }
    }
}


function salvaDadosdaProducaoemArquivo(data) {

    var json = JSON.stringify(data, null, " ");

    fs.writeFileSync("./resultado_artigos_com_conceito.json", json, (err) => {
        if(err) {
            return console.log("Erro na criação de arquivo de avaliação de publicações: " + err);
        }
    }); 
}


function verificaSeArquivoFoiCriado() {

    if (fs.existsSync('./resultado_artigos_com_conceito.json')) {
        console.log("Arquivo de avaliação de publicações criado com sucesso."); 
    }
}