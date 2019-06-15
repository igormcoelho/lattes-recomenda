module.exports = {
    AvaliacaoPublicacao: AvaliacaoPublicacao,
    cruzaDadosArt: cruzaDadosArt
}


function AvaliacaoPublicacao(config, callback) {

    if (!config.classificacoesPublicadas) {

        callback(new Error("Você não informou o arquivo xls de entrada."), null);
        
    } else if (!config.curriculoLattes) {

        callback(new Error("Você não informou o arquivo xml de entrada."), null);
    
    }

    new Publicacao(config, callback);
}
    

function Publicacao(config, callback) { 
    
    const Parse = require('./ParseData');
    const dados = require('./Dados');
    
    let parse = new Parse();

    let jsonLattesObj = parse.parseXmlToJson(config.curriculoLattes, callback);
    let jsonQualisObj = parse.parseXlsToJson(config.classificacoesPublicadas, callback);
    let lattesArtigos = dados.retornaLattesArtigos(jsonLattesObj);

    let artigos = cruzaDadosArt(lattesArtigos, jsonQualisObj, config.anoInicial, config.anoFinal, 'publicacao');
    
    if ( artigos.artigos.length >= 1 ) { console.log(artigos); } else { console.log('Não há artigos para o intervalo informado.'); }    
}


function cruzaDadosArt(dadosLattes, dadosQualis, anoInicial, anoFinal, origem) {

    let dadosArtigos = { artigos: [] },
        qualis = []; 

    for ( var i in dadosLattes ) {
            
        let artigo = {}, periodico = {};

        artigo.titulo = dadosLattes[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["TITULO-DO-ARTIGO"];
        artigo.ano = parseInt(dadosLattes[i]['DADOS-BASICOS-DO-ARTIGO']["_attributes"]["ANO-DO-ARTIGO"]);
        artigo.issn = dadosLattes[i]['DETALHAMENTO-DO-ARTIGO']["_attributes"]["ISSN"];
        
        if ( artigo.ano >= anoInicial && artigo.ano <= anoFinal ) {

            for ( var j in dadosQualis ) {

                periodico.issn = dadosQualis[j]['ISSN'];
                periodico.issn = periodico.issn.split('-').join('');
                periodico.nome = dadosQualis[j]['Título'];
                

                if ( artigo.issn == periodico.issn.trim() ) {

                    artigo.qualis = dadosQualis[j]['Estrato'];
                    artigo.periodico = periodico.nome;
                    
                    dadosArtigos.artigos.push(artigo);
                    qualis.push(artigo.qualis);
                    break;
                }
            }
        }    
    }

    return origem == 'indice' ? qualis : dadosArtigos;
}
