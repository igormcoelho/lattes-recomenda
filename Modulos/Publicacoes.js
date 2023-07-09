const dados = require('./Dados');

module.exports = {
    AvaliacaoPublicacao: AvaliacaoPublicacao,
    cruzaDadosArt: cruzaDadosArt
}


function AvaliacaoPublicacao(config, callback) {

    if (!config.classificacoesPublicadasJSON) {

        callback(new Error("Você não informou o arquivo qualis json de entrada."), null);
        
    } else if (!config.curriculoLattesJSON) {

        callback(new Error("Você não informou o arquivo curriculo json de entrada."), null);
    
    }

    new Publicacao(config, callback);
}
    

function Publicacao(config, callback) { 
    // TODO: prevent XLS parsing in browser mode
    let jsonQualisObj = {};
    if(false) {
        const ParseXLS = require('../ModulosHelper/ParseDataFS');
        let parse = new Parse();    
        jsonQualisObj = parse.parseXlsFileToJson(config.classificacoesPublicadasXLS, callback);
    }
    jsonQualisObj = config.classificacoesPublicadasJSON;
    
    // get curriculo from XML file
    if(false) {
        const Parse = require('./ParseData');
        let parse = new Parse();    
        let jsonLattesObj = parse.parseXmlFileToJson(config.curriculoLattes, callback);
    }
    let jsonLattesObj = config.curriculoLattesJSON;
    let lattesArtigos = dados.retornaLattesArtigos(jsonLattesObj);

    if (lattesArtigos) {
        dados.retornaDadosPesquisador(jsonLattesObj, 'Avaliação de publicações');
        cruzaDadosArt(lattesArtigos, jsonQualisObj, config.anoInicial, config.anoFinal, 'publicacao');    
    }
}


function cruzaDadosArt(dadosLattes, dadosQualis, anoInicial, anoFinal, origem) {

    let dadosArtigos = { artigos: [] }, qualis = [], 
        artigosNaoEncontrados = [], flag, cont;

    for ( var i in dadosLattes ) {
            
        let artigo = {}, periodico = {};

        artigo.titulo = dadosLattes[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["TITULO-DO-ARTIGO"];
        artigo.ano = parseInt(dadosLattes[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["ANO-DO-ARTIGO"]);
        artigo.issn = dadosLattes[i]['DETALHAMENTO-DO-ARTIGO']["_attributes"]["ISSN"];
        
        if ( artigo.ano >= anoInicial && artigo.ano <= anoFinal ) {

            cont = 0; flag = false; 

            for ( var j in dadosQualis ) {

                periodico.issn = dadosQualis[j]['ISSN'];
                periodico.issn = periodico.issn.split('-').join('');
                periodico.nome = dadosQualis[j]['Título'];
                
                if ( artigo.issn == periodico.issn.trim() ) {

                    artigo.qualis = dadosQualis[j]['Estrato'];
                    artigo.periodico = periodico.nome;
                    
                    dadosArtigos.artigos.push(artigo);
                    qualis.push(artigo.qualis);
                    flag = true;
                    break;
                }

                cont++;

                if ( cont == dadosQualis.length && flag == false ) {
                    
                    artigosNaoEncontrados.push(artigo);
                }
            }
        }    
    }

    if ( dadosArtigos.artigos.length == 0 && artigosNaoEncontrados.length == 0 ) {
        
        if ( origem == 'indice' ) {
            console.log('Não há artigos publicados nos últimos quatro anos.');
        } else {
            console.log('Não há artigos para o intervalo informado.');
        }
        
    } else { 
        dados.verificaLista(dadosArtigos.artigos, 'ARTIGOS ENCONTRADOS', './resultado_periodicos_encontrados.json');
        dados.verificaLista(artigosNaoEncontrados, 'ARTIGOS NÃO ENCONTRADOS', './resultado_periodicos_nao_encontrados.json');
    }

    if ( origem == 'indice' ) return qualis;
}